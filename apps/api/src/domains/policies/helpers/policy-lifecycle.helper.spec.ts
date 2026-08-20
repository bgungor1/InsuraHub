import { ConflictException } from '@nestjs/common';
import { PolicyState, Prisma } from '@prisma/client';
import { PolicyLifecycleHelper } from './policy-lifecycle.helper';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PolicyLifecycleHelper', () => {
  const mockPolicyAssignment = {
    upsert: jest.fn(),
    updateMany: jest.fn(),
  };

  const mockPolicy = {
    update: jest.fn(),
  };

  const mockCommissionRule = {
    findFirst: jest.fn(),
  };

  const mockCommissionSnapshot = {
    create: jest.fn(),
  };

  const mockPrisma = {
    policyAssignment: mockPolicyAssignment,
    policy: mockPolicy,
    commissionRule: mockCommissionRule,
    commissionSnapshot: mockCommissionSnapshot,
    $transaction: jest.fn(
      (callback: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        callback({
          policyAssignment: mockPolicyAssignment,
          policy: mockPolicy,
          commissionSnapshot: mockCommissionSnapshot,
        } as unknown as Prisma.TransactionClient),
    ),
  } as unknown as PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('claimPolicy', () => {
    it('should upsert assignment and update policy state to CLAIMED', async () => {
      mockPolicy.update.mockResolvedValue({
        id: 'pol_1',
        state: PolicyState.CLAIMED,
        brokerId: 'broker_1',
      });

      const result = await PolicyLifecycleHelper.claimPolicy(
        mockPrisma,
        'pol_1',
        'broker_1',
      );

      expect(mockPolicyAssignment.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { policyId: 'pol_1' } }),
      );
      expect(mockPolicy.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'pol_1' },
          data: { state: PolicyState.CLAIMED, brokerId: 'broker_1' },
        }),
      );
      expect(result).toBeDefined();
    });
  });

  describe('releasePolicy', () => {
    it('should update assignments and reset policy state to UNASSIGNED', async () => {
      mockPolicy.update.mockResolvedValue({
        id: 'pol_1',
        state: PolicyState.UNASSIGNED,
        brokerId: null,
      });

      const result = await PolicyLifecycleHelper.releasePolicy(
        mockPrisma,
        'pol_1',
        'Müşteri vazgeçti',
      );

      expect(mockPolicyAssignment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { policyId: 'pol_1' },
          data: expect.objectContaining({ releaseReason: 'Müşteri vazgeçti' }),
        }),
      );
      expect(mockPolicy.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'pol_1' },
          data: { state: PolicyState.UNASSIGNED, brokerId: null },
        }),
      );
      expect(result).toBeDefined();
    });
  });

  describe('completePolicy', () => {
    it('should throw ConflictException when no active commission rule is found', async () => {
      mockCommissionRule.findFirst.mockResolvedValue(null);

      await expect(
        PolicyLifecycleHelper.completePolicy(mockPrisma, 'pol_1', 10000),
      ).rejects.toThrow(ConflictException);
    });

    it('should calculate snapshot and update state to COMPLETED', async () => {
      mockCommissionRule.findFirst.mockResolvedValue({
        id: 'rule_1',
        companyShare: 40,
        agencyShare: 30,
        branchShare: 15,
        brokerShare: 15,
      });

      mockPolicy.update.mockResolvedValue({
        id: 'pol_1',
        state: PolicyState.COMPLETED,
      });

      const result = await PolicyLifecycleHelper.completePolicy(
        mockPrisma,
        'pol_1',
        10000,
      );

      expect(mockCommissionSnapshot.create).toHaveBeenCalled();
      expect(mockPolicy.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'pol_1' },
          data: { state: PolicyState.COMPLETED },
        }),
      );
      expect(result).toBeDefined();
    });
  });
});
