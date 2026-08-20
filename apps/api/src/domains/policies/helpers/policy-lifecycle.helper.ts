import { ConflictException } from '@nestjs/common';
import { PolicyState } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CommissionCalculatorHelper } from './commission-calculator.helper';

export class PolicyLifecycleHelper {
  static async claimPolicy(
    prisma: PrismaService,
    policyId: string,
    userId: string,
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.policyAssignment.upsert({
        where: { policyId },
        create: {
          policyId,
          claimedById: userId,
          assignedAt: new Date(),
        },
        update: {
          claimedById: userId,
          assignedAt: new Date(),
          releasedAt: null,
          releaseReason: null,
        },
      });

      return tx.policy.update({
        where: { id: policyId },
        data: { state: PolicyState.CLAIMED, brokerId: userId },
        include: {
          customer: true,
          branch: true,
          broker: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    });
  }

  static async releasePolicy(
    prisma: PrismaService,
    policyId: string,
    reason?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.policyAssignment.updateMany({
        where: { policyId },
        data: {
          releasedAt: new Date(),
          releaseReason: reason || 'Manuel havuz iadesi',
        },
      });

      return tx.policy.update({
        where: { id: policyId },
        data: { state: PolicyState.UNASSIGNED, brokerId: null },
      });
    });
  }

  static async completePolicy(
    prisma: PrismaService,
    policyId: string,
    totalAmount: number,
  ) {
    const now = new Date();
    const activeRule = await prisma.commissionRule.findFirst({
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
      throw new ConflictException(
        'Poliçeyi tamamlamak için geçerli bir komisyon kuralı bulunamadı.',
      );
    }

    const shares = CommissionCalculatorHelper.calculateShares(
      totalAmount,
      activeRule,
    );

    return prisma.$transaction(async (tx) => {
      await tx.commissionSnapshot.create({
        data: {
          policyId,
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
        where: { id: policyId },
        data: { state: PolicyState.COMPLETED },
        include: { snapshot: true, customer: true },
      });
    });
  }
}
