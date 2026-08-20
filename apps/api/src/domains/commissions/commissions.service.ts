import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/decorators';
import { CreateCommissionRuleDto, QueryCommissionDto } from './dto';
import { CommissionCalculatorHelper } from './helpers/commission-calculator.helper';
import { CommissionScopeHelper } from './helpers/commission-scope.helper';

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
        where: {
          OR: [
            { validUntil: null },
            { validUntil: { isSet: false } },
            { validUntil: { gt: now } },
          ],
        },
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
        OR: [
          { validUntil: null },
          { validUntil: { isSet: false } },
          { validUntil: { gte: now } },
        ],
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
        OR: [
          { validUntil: null },
          { validUntil: { isSet: false } },
          { validUntil: { gte: now } },
        ],
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
    const { skip, take } = query;
    const where = await CommissionScopeHelper.buildSnapshotWhere(
      this.prisma,
      query,
      user,
    );

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

    CommissionScopeHelper.verifySnapshotAccess(snapshot, user);

    return snapshot;
  }
}
