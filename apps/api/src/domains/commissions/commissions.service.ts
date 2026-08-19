import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/decorators';
import { CreateCommissionRuleDto, QueryCommissionDto } from './dto';
import { CommissionCalculatorHelper } from './helpers/commission-calculator.helper';

@Injectable()
export class CommissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRule(dto: CreateCommissionRuleDto) {
    const totalShare =
      dto.companyShare + dto.agencyShare + dto.branchShare + dto.brokerShare;

    if (Math.abs(totalShare - 100) > 0.001) {
      throw new BadRequestException(
        'Komisyon paylarının toplamı tam olarak 100 olmalıdır.',
      );
    }

    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      await tx.commissionRule.updateMany({
        where: { validUntil: null },
        data: { validUntil: now },
      });

      return tx.commissionRule.create({
        data: {
          name: dto.name,
          companyShare: dto.companyShare,
          agencyShare: dto.agencyShare,
          branchShare: dto.branchShare,
          brokerShare: dto.brokerShare,
          validFrom: dto.validFrom ? new Date(dto.validFrom) : now,
          validUntil: null,
        },
      });
    });
  }

  async getActiveRules() {
    const now = new Date();
    return this.prisma.commissionRule.findMany({
      where: {
        validFrom: { lte: now },
        OR: [{ validUntil: null }, { validUntil: { gte: now } }],
      },
      orderBy: { validFrom: 'desc' },
    });
  }

  async getAllRules() {
    return this.prisma.commissionRule.findMany({
      orderBy: { validFrom: 'desc' },
    });
  }

  async calculateAndSnapshot(policyId: string, customAmount?: number) {
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId },
      include: { branch: true, snapshot: true },
    });

    if (!policy) {
      throw new NotFoundException('Poliçe bulunamadı.');
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
      throw new NotFoundException('Geçerli bir komisyon kuralı bulunamadı.');
    }

    const amount = customAmount ?? policy.snapshot?.totalAmount ?? 0;
    if (amount <= 0) {
      throw new BadRequestException(
        'Komisyon hesabı için prim tutarı 0 dan büyük olmalıdır.',
      );
    }

    const shares = CommissionCalculatorHelper.calculateShares(
      amount,
      activeRule,
    );

    return this.prisma.commissionSnapshot.upsert({
      where: { policyId },
      create: {
        policyId,
        commissionRuleId: activeRule.id,
        totalAmount: shares.totalAmount,
        companyAmount: shares.companyAmount,
        agencyAmount: shares.agencyAmount,
        branchAmount: shares.branchAmount,
        brokerAmount: shares.brokerAmount,
        calculatedAt: now,
      },
      update: {
        commissionRuleId: activeRule.id,
        totalAmount: shares.totalAmount,
        companyAmount: shares.companyAmount,
        agencyAmount: shares.agencyAmount,
        branchAmount: shares.branchAmount,
        brokerAmount: shares.brokerAmount,
        calculatedAt: now,
      },
      include: {
        rule: true,
        policy: {
          include: {
            customer: {
              select: { firstName: true, lastName: true, identityNo: true },
            },
            branch: { select: { name: true } },
            broker: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async findAllSnapshots(query: QueryCommissionDto, user: AuthenticatedUser) {
    const { skip, take, ruleId, startDate, endDate } = query;
    const where: Prisma.CommissionSnapshotWhereInput = {};

    if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      where.policy = { branch: { agencyId: user.agencyId } };
    } else if (user.role === UserRole.BRANCH_MANAGER && user.branchId) {
      where.policy = { branchId: user.branchId };
    } else if (user.role === UserRole.BROKER) {
      where.policy = { brokerId: user.userId };
    }

    if (ruleId) where.commissionRuleId = ruleId;

    if (startDate || endDate) {
      where.calculatedAt = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.commissionSnapshot.findMany({
        where,
        skip,
        take,
        orderBy: { calculatedAt: 'desc' },
        include: {
          rule: { select: { id: true, name: true } },
          policy: {
            include: {
              customer: {
                select: { firstName: true, lastName: true, identityNo: true },
              },
              branch: { select: { id: true, name: true } },
              broker: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      }),
      this.prisma.commissionSnapshot.count({ where }),
    ]);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findSnapshotByPolicyId(policyId: string, user: AuthenticatedUser) {
    const snapshot = await this.prisma.commissionSnapshot.findUnique({
      where: { policyId },
      include: {
        rule: true,
        policy: {
          include: {
            customer: true,
            branch: { include: { agency: true } },
            broker: true,
          },
        },
      },
    });

    if (!snapshot) {
      throw new NotFoundException(
        'Bu poliçeye ait komisyon dekontu bulunamadı.',
      );
    }

    if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      if (snapshot.policy.branch.agencyId !== user.agencyId) {
        throw new ConflictException(
          'Bu komisyon dekontunu görüntüleme yetkiniz yok.',
        );
      }
    } else if (user.role === UserRole.BRANCH_MANAGER && user.branchId) {
      if (snapshot.policy.branchId !== user.branchId) {
        throw new ConflictException(
          'Bu komisyon dekontunu görüntüleme yetkiniz yok.',
        );
      }
    } else if (
      user.role === UserRole.BROKER &&
      snapshot.policy.brokerId !== user.userId
    ) {
      throw new ConflictException(
        'Bu komisyon dekontunu görüntüleme yetkiniz yok.',
      );
    }

    return snapshot;
  }
}
