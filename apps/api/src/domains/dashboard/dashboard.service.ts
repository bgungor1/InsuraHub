import { Injectable } from '@nestjs/common';
import { PolicyState, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/decorators';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummaryStats(user: AuthenticatedUser) {
    const policyWhere: Prisma.PolicyWhereInput = {};
    const snapshotWhere: Prisma.CommissionSnapshotWhereInput = {};

    if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      policyWhere.branch = { agencyId: user.agencyId };
      snapshotWhere.policy = { branch: { agencyId: user.agencyId } };
    } else if (user.role === UserRole.BRANCH_MANAGER && user.branchId) {
      policyWhere.branchId = user.branchId;
      snapshotWhere.policy = { branchId: user.branchId };
    } else if (user.role === UserRole.BROKER) {
      policyWhere.brokerId = user.userId;
      snapshotWhere.policy = { brokerId: user.userId };
    }

    const [
      totalPolicies,
      draftCount,
      unassignedCount,
      claimedCount,
      completedCount,
      cancelledCount,
      commissionAgg,
      totalCustomers,
      recentSnapshots,
    ] = await Promise.all([
      this.prisma.policy.count({ where: policyWhere }),
      this.prisma.policy.count({
        where: { ...policyWhere, state: PolicyState.DRAFT },
      }),
      this.prisma.policy.count({
        where: { ...policyWhere, state: PolicyState.UNASSIGNED },
      }),
      this.prisma.policy.count({
        where: { ...policyWhere, state: PolicyState.CLAIMED },
      }),
      this.prisma.policy.count({
        where: { ...policyWhere, state: PolicyState.COMPLETED },
      }),
      this.prisma.policy.count({
        where: { ...policyWhere, state: PolicyState.CANCELLED },
      }),
      this.prisma.commissionSnapshot.aggregate({
        where: snapshotWhere,
        _sum: {
          totalAmount: true,
          companyAmount: true,
          agencyAmount: true,
          branchAmount: true,
          brokerAmount: true,
        },
      }),
      this.prisma.customer.count(),
      this.prisma.commissionSnapshot.findMany({
        where: snapshotWhere,
        take: 5,
        orderBy: { calculatedAt: 'desc' },
        include: {
          policy: {
            select: {
              product: true,
              customer: { select: { firstName: true, lastName: true } },
              branch: { select: { name: true } },
              broker: { select: { firstName: true, lastName: true } },
            },
          },
        },
      }),
    ]);

    const totalPremium = commissionAgg._sum.totalAmount ?? 0;

    return {
      policiesByState: [
        { state: PolicyState.DRAFT, label: 'Taslak', count: draftCount },
        {
          state: PolicyState.UNASSIGNED,
          label: 'Beklemede',
          count: unassignedCount,
        },
        {
          state: PolicyState.CLAIMED,
          label: 'Üzerine Alındı',
          count: claimedCount,
        },
        {
          state: PolicyState.COMPLETED,
          label: 'Tamamlandı',
          count: completedCount,
        },
        { state: PolicyState.CANCELLED, label: 'İptal', count: cancelledCount },
      ],
      counters: {
        totalPolicies,
        activeClaims: claimedCount + unassignedCount,
        completedPolicies: completedCount,
        totalCustomers,
      },
      financials: {
        totalPremium,
        commissions: {
          company: commissionAgg._sum.companyAmount ?? 0,
          agency: commissionAgg._sum.agencyAmount ?? 0,
          branch: commissionAgg._sum.branchAmount ?? 0,
          broker: commissionAgg._sum.brokerAmount ?? 0,
        },
      },
      recentActivities: recentSnapshots.map((s) => ({
        id: s.id,
        policyId: s.policyId,
        product: s.policy?.product ?? 'Poliçe',
        customerName: s.policy?.customer
          ? `${s.policy.customer.firstName} ${s.policy.customer.lastName}`
          : 'Bilinmeyen Müşteri',
        branchName: s.policy?.branch?.name ?? '-',
        brokerName: s.policy?.broker
          ? `${s.policy.broker.firstName} ${s.policy.broker.lastName}`
          : '-',
        totalAmount: s.totalAmount,
        calculatedAt: s.calculatedAt,
      })),
    };
  }
}
