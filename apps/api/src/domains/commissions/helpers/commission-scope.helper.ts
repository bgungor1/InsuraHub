import { ConflictException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../../auth/decorators';
import { QueryCommissionDto } from '../dto';

export class CommissionScopeHelper {
  static async buildSnapshotWhere(
    prisma: PrismaService,
    query: QueryCommissionDto,
    user: AuthenticatedUser,
  ): Promise<Prisma.CommissionSnapshotWhereInput> {
    const { ruleId, startDate, endDate } = query;
    const where: Prisma.CommissionSnapshotWhereInput = {};

    if (user.role === UserRole.COMPANY_USER && user.companyId) {
      const policies = await prisma.policy.findMany({
        where: { branch: { agency: { companyId: user.companyId } } },
        select: { id: true },
      });
      where.policyId = { in: policies.map((p) => p.id) };
    } else if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      const policies = await prisma.policy.findMany({
        where: { branch: { agencyId: user.agencyId } },
        select: { id: true },
      });
      where.policyId = { in: policies.map((p) => p.id) };
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

    return where;
  }

  static verifySnapshotAccess(
    snapshot: {
      policy: {
        brokerId: string | null;
        branchId: string;
        branch: { agencyId: string; agency: { companyId: string } };
      };
    },
    user: AuthenticatedUser,
  ): void {
    if (user.role === UserRole.SUPERADMIN) return;

    if (user.role === UserRole.COMPANY_USER && user.companyId) {
      if (snapshot.policy.branch.agency.companyId !== user.companyId) {
        throw new ConflictException(
          'Bu komisyon dekontunu görüntüleme yetkiniz yok.',
        );
      }
    } else if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
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
  }
}
