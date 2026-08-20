import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PolicyState, UserRole } from '@prisma/client';
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
import { PolicyCustomerHelper } from './helpers/policy-customer.helper';
import { PolicyLifecycleHelper } from './helpers/policy-lifecycle.helper';
import { PolicyQueryHelper } from './helpers/policy-query.helper';
import { PolicyNotificationHelper } from './helpers/policy-notification.helper';
import { PoliciesGateway } from './policies.gateway';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policiesGateway: PoliciesGateway,
    private readonly auditLogsService: AuditLogsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreatePolicyDto, user: AuthenticatedUser) {
    const customerId = await PolicyCustomerHelper.resolveCustomerId(
      this.prisma,
      dto,
    );
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

    const policy = await this.prisma.policy.create({
      data: {
        product: dto.product,
        state,
        customerId,
        branchId,
        brokerId,
        previousPolicyId: dto.previousPolicyId ?? null,
        plateNumber: dto.plateNumber ?? null,
        coverageAmount: dto.coverageAmount ?? null,
        uavtCode: dto.uavtCode ?? null,
        paymentTerm: dto.paymentTerm ?? null,
        totalAmount: dto.totalAmount ?? null,
      },
    });

    if (state === PolicyState.CLAIMED && brokerId) {
      await this.prisma.policyAssignment.create({
        data: {
          policyId: policy.id,
          claimedById: brokerId,
          assignedAt: new Date(),
        },
      });
    }

    await this.auditLogsService.logAction({
      actorId: user.userId,
      action: 'CREATE_POLICY',
      entityType: 'POLICY',
      entityId: policy.id,
      before: null,
      after: { product: policy.product, state: policy.state, branchId },
    });

    await PolicyNotificationHelper.notifyOnPolicyCreated(
      this.prisma,
      this.notificationsService,
      policy,
      user.userId,
    );

    this.policiesGateway.broadcastPolicyCreated({
      policyId: policy.id,
      product: policy.product,
      branchId: policy.branchId,
    });
    return policy;
  }

  async findAll(query: QueryPolicyDto, user: AuthenticatedUser) {
    const { skip, take } = query;
    const where = PolicyQueryHelper.buildWhereClause(query, user);

    const [items, total] = await Promise.all([
      this.prisma.policy.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: PolicyQueryHelper.getFindAllIncludes(),
      }),
      this.prisma.policy.count({ where }),
    ]);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const policy = await this.prisma.policy.findUnique({
      where: { id },
      include: PolicyQueryHelper.getFindOneIncludes(),
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
      throw new ConflictException(
        'Poliçe havuzda değil veya başka bir broker tarafından alınmış.',
      );
    }

    const updated = await PolicyLifecycleHelper.claimPolicy(
      this.prisma,
      id,
      user.userId,
    );

    await this.auditLogsService.logAction({
      actorId: user.userId,
      action: 'CLAIM_POLICY',
      entityType: 'POLICY',
      entityId: id,
      before: { state: policy.state, brokerId: policy.brokerId },
      after: { state: PolicyState.CLAIMED, brokerId: user.userId },
    });

    this.policiesGateway.broadcastPolicyClaimed(id, user.userId);
    return updated;
  }

  async release(id: string, dto: ReleasePolicyDto, user: AuthenticatedUser) {
    const policy = await this.prisma.policy.findUnique({ where: { id } });
    if (!policy) throw new NotFoundException('Poliçe bulunamadı.');
    PolicyScopeHelper.verifyPolicyScope(policy, user);

    if (policy.state !== PolicyState.CLAIMED) {
      throw new ConflictException(
        'Yalnızca talep edilmiş poliçeler havuza bırakılabilir.',
      );
    }

    if (user.role === UserRole.BROKER && policy.brokerId !== user.userId) {
      throw new ForbiddenException(
        'Yalnızca kendi üzerinize aldığınız poliçeyi bırakabilirsiniz.',
      );
    }

    const updated = await PolicyLifecycleHelper.releasePolicy(
      this.prisma,
      id,
      dto.reason,
    );

    await this.auditLogsService.logAction({
      actorId: user.userId,
      action: 'RELEASE_POLICY',
      entityType: 'POLICY',
      entityId: id,
      before: { state: policy.state, brokerId: policy.brokerId },
      after: { state: PolicyState.UNASSIGNED, reason: dto.reason },
    });

    await PolicyNotificationHelper.notifyOnPolicyReleased(
      this.prisma,
      this.notificationsService,
      { product: updated.product, branchId: policy.branchId },
      user.userId,
    );

    this.policiesGateway.broadcastPolicyReleased(id);
    return updated;
  }

  async complete(id: string, dto: CompletePolicyDto, user: AuthenticatedUser) {
    const policy = await this.prisma.policy.findUnique({ where: { id } });
    if (!policy) throw new NotFoundException('Poliçe bulunamadı.');
    PolicyScopeHelper.verifyPolicyScope(policy, user);

    if (policy.state !== PolicyState.CLAIMED) {
      throw new ConflictException(
        'Yalnızca talep edilmiş ve işlenen poliçeler tamamlanabilir.',
      );
    }

    const updated = await PolicyLifecycleHelper.completePolicy(
      this.prisma,
      id,
      dto.totalAmount,
    );

    await this.auditLogsService.logAction({
      actorId: user.userId,
      action: 'COMPLETE_POLICY',
      entityType: 'POLICY',
      entityId: id,
      before: { state: policy.state },
      after: { state: PolicyState.COMPLETED, totalAmount: dto.totalAmount },
    });

    await PolicyNotificationHelper.notifyOnPolicyCompleted(
      this.notificationsService,
      { product: updated.product, brokerId: updated.brokerId },
      dto.totalAmount,
    );

    this.policiesGateway.broadcastPolicyCompleted(id);
    return updated;
  }

  async cancel(id: string, user: AuthenticatedUser) {
    const policy = await this.findOne(id, user);
    if (policy.state === PolicyState.COMPLETED) {
      throw new ConflictException(
        'Tamamlanmış ve komisyonu hesaplanmış poliçe iptal edilemez.',
      );
    }

    const updated = await this.prisma.policy.update({
      where: { id },
      data: { state: PolicyState.CANCELLED },
    });

    await this.auditLogsService.logAction({
      actorId: user.userId,
      action: 'CANCEL_POLICY',
      entityType: 'POLICY',
      entityId: id,
      before: { state: policy.state },
      after: { state: PolicyState.CANCELLED },
    });

    return updated;
  }

  async update(id: string, dto: UpdatePolicyDto, user: AuthenticatedUser) {
    const policy = await this.findOne(id, user);
    if (policy.state === PolicyState.COMPLETED) {
      throw new ConflictException(
        'Tamamlanmış poliçeler üzerinde düzenleme yapılamaz.',
      );
    }

    const updated = await this.prisma.policy.update({
      where: { id },
      data: {
        ...(dto.product && { product: dto.product }),
        ...(dto.state && { state: dto.state }),
        ...(dto.customerId && { customerId: dto.customerId }),
      },
    });

    await this.auditLogsService.logAction({
      actorId: user.userId,
      action: 'UPDATE_POLICY',
      entityType: 'POLICY',
      entityId: id,
      before: { product: policy.product, state: policy.state },
      after: { product: updated.product, state: updated.state },
    });

    return updated;
  }

  async remove(id: string, user: AuthenticatedUser) {
    const policy = await this.findOne(id, user);
    if (policy.state === PolicyState.COMPLETED) {
      throw new ConflictException('Tamamlanmış poliçe kaydı silinemez.');
    }

    await this.auditLogsService.logAction({
      actorId: user.userId,
      action: 'DELETE_POLICY',
      entityType: 'POLICY',
      entityId: id,
      before: { product: policy.product, state: policy.state },
      after: null,
    });

    return this.prisma.policy.delete({ where: { id } });
  }
}
