import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PolicyState, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/decorators';
import {
  CompletePolicyDto,
  CreatePolicyDto,
  QueryPolicyDto,
  ReleasePolicyDto,
  UpdatePolicyDto,
} from './dto';
import { PolicyScopeHelper } from './helpers/policy-scope.helper';
import { CommissionCalculatorHelper } from './helpers/commission-calculator.helper';

@Injectable()
export class PoliciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePolicyDto, user: AuthenticatedUser) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) throw new NotFoundException('Belirtilen müşteri bulunamadı.');

    const branchId = PolicyScopeHelper.resolveBranchId(dto.branchId, user);

    if (dto.previousPolicyId) {
      const prev = await this.prisma.policy.findUnique({
        where: { id: dto.previousPolicyId },
      });
      if (!prev) throw new NotFoundException('Önceki poliçe kaydı bulunamadı.');
    }

    const state = dto.state ?? PolicyState.UNASSIGNED;
    const brokerId =
      state === PolicyState.CLAIMED
        ? (dto.brokerId ?? user.userId)
        : (dto.brokerId ?? null);

    return this.prisma.policy.create({
      data: {
        product: dto.product,
        state,
        customerId: dto.customerId,
        branchId,
        brokerId,
        previousPolicyId: dto.previousPolicyId ?? null,
      },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, identityNo: true } },
        branch: { select: { id: true, name: true } },
        broker: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findAll(query: QueryPolicyDto, user: AuthenticatedUser) {
    const { skip, take, search, state, customerId, branchId, brokerId, product } = query;
    const where: Prisma.PolicyWhereInput = {};

    PolicyScopeHelper.applyOrganizationalScope(where, user);

    if (state) where.state = state;
    if (customerId) where.customerId = customerId;
    if (branchId && user.role === UserRole.SUPERADMIN) where.branchId = branchId;
    if (brokerId) where.brokerId = brokerId;
    if (product) where.product = { contains: product, mode: 'insensitive' };

    if (search) {
      where.OR = [
        { product: { contains: search, mode: 'insensitive' } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
        { customer: { identityNo: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.policy.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, firstName: true, lastName: true, identityNo: true } },
          branch: { select: { id: true, name: true } },
          broker: { select: { id: true, firstName: true, lastName: true } },
          snapshot: { select: { id: true, totalAmount: true } },
        },
      }),
      this.prisma.policy.count({ where }),
    ]);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const policy = await this.prisma.policy.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: { include: { agency: { include: { company: true } } } },
        broker: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignment: { include: { claimedBy: { select: { id: true, firstName: true, lastName: true } } } },
        snapshot: { include: { rule: true } },
        previousPolicy: true,
        renewals: true,
      },
    });

    if (!policy) throw new NotFoundException('Poliçe bulunamadı.');
    PolicyScopeHelper.verifyPolicyScope(policy, user);
    return policy;
  }

  async claim(id: string, user: AuthenticatedUser) {
    const policy = await this.prisma.policy.findUnique({ where: { id } });
    if (!policy) throw new NotFoundException('Poliçe bulunamadı.');
    PolicyScopeHelper.verifyPolicyScope(policy, user);

    if (policy.state !== PolicyState.UNASSIGNED) {
      throw new ConflictException('Poliçe havuzda değil veya başka bir broker tarafından alınmış.');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.policyAssignment.upsert({
        where: { policyId: id },
        create: { policyId: id, claimedById: user.userId, assignedAt: new Date() },
        update: { claimedById: user.userId, assignedAt: new Date(), releasedAt: null, releaseReason: null },
      });

      return tx.policy.update({
        where: { id },
        data: { state: PolicyState.CLAIMED, brokerId: user.userId },
        include: {
          customer: true,
          branch: true,
          broker: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    });
  }

  async release(id: string, dto: ReleasePolicyDto, user: AuthenticatedUser) {
    const policy = await this.prisma.policy.findUnique({ where: { id } });
    if (!policy) throw new NotFoundException('Poliçe bulunamadı.');
    PolicyScopeHelper.verifyPolicyScope(policy, user);

    if (policy.state !== PolicyState.CLAIMED) {
      throw new ConflictException('Yalnızca talep edilmiş poliçeler havuza bırakılabilir.');
    }

    if (user.role === UserRole.BROKER && policy.brokerId !== user.userId) {
      throw new ForbiddenException('Yalnızca kendi üzerinize aldığınız poliçeyi bırakabilirsiniz.');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.policyAssignment.updateMany({
        where: { policyId: id },
        data: { releasedAt: new Date(), releaseReason: dto.reason || 'Manuel havuz iadesi' },
      });

      return tx.policy.update({
        where: { id },
        data: { state: PolicyState.UNASSIGNED, brokerId: null },
      });
    });
  }

  async complete(id: string, dto: CompletePolicyDto, user: AuthenticatedUser) {
    const policy = await this.prisma.policy.findUnique({ where: { id } });
    if (!policy) throw new NotFoundException('Poliçe bulunamadı.');
    PolicyScopeHelper.verifyPolicyScope(policy, user);

    if (policy.state !== PolicyState.CLAIMED) {
      throw new ConflictException('Yalnızca talep edilmiş ve işlenen poliçeler tamamlanabilir.');
    }

    const now = new Date();
    const activeRule = await this.prisma.commissionRule.findFirst({
      where: {
        validFrom: { lte: now },
        OR: [{ validUntil: null }, { validUntil: { gte: now } }],
      },
      orderBy: { validFrom: 'desc' },
    });

    if (!activeRule) {
      throw new ConflictException('Poliçeyi tamamlamak için geçerli bir komisyon kuralı bulunamadı.');
    }

    const shares = CommissionCalculatorHelper.calculateShares(dto.totalAmount, activeRule);

    return this.prisma.$transaction(async (tx) => {
      await tx.commissionSnapshot.create({
        data: {
          policyId: id,
          commissionRuleId: activeRule.id,
          totalAmount: shares.totalAmount,
          brokerAmount: shares.brokerAmount,
          branchAmount: shares.branchAmount,
          agencyAmount: shares.agencyAmount,
          companyAmount: shares.companyAmount,
          calculatedAt: now,
        },
      });

      return tx.policy.update({
        where: { id },
        data: { state: PolicyState.COMPLETED },
        include: { snapshot: true, customer: true },
      });
    });
  }

  async cancel(id: string, user: AuthenticatedUser) {
    const policy = await this.findOne(id, user);
    if (policy.state === PolicyState.COMPLETED) {
      throw new ConflictException('Tamamlanmış ve komisyonu hesaplanmış poliçe iptal edilemez.');
    }

    return this.prisma.policy.update({
      where: { id },
      data: { state: PolicyState.CANCELLED },
    });
  }

  async update(id: string, dto: UpdatePolicyDto, user: AuthenticatedUser) {
    const policy = await this.findOne(id, user);
    if (policy.state === PolicyState.COMPLETED) {
      throw new ConflictException('Tamamlanmış poliçeler üzerinde düzenleme yapılamaz.');
    }

    return this.prisma.policy.update({
      where: { id },
      data: {
        ...(dto.product && { product: dto.product }),
        ...(dto.state && { state: dto.state }),
        ...(dto.customerId && { customerId: dto.customerId }),
      },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    const policy = await this.findOne(id, user);
    if (policy.state === PolicyState.COMPLETED) {
      throw new ConflictException('Tamamlanmış poliçe kaydı silinemez.');
    }

    return this.prisma.policy.delete({ where: { id } });
  }
}
