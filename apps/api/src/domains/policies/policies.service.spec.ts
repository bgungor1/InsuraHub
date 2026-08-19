import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PolicyState, UserRole } from '@prisma/client';
import { PoliciesService } from './policies.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PoliciesGateway } from './policies.gateway';

describe('PoliciesService (State Machine & Concurrency)', () => {
  let service: PoliciesService;
  let prisma: any;
  let gateway: any;

  const mockBrokerUser = {
    userId: 'broker_123',
    role: UserRole.BROKER,
    branchId: 'branch_abc',
    email: 'broker@insurahub.com',
  };

  const mockOtherBrokerUser = {
    userId: 'broker_999',
    role: UserRole.BROKER,
    branchId: 'branch_abc',
    email: 'other@insurahub.com',
  };

  beforeEach(async () => {
    prisma = {
      policy: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      customer: { findUnique: jest.fn() },
      branch: { findUnique: jest.fn() },
      commissionRule: { findFirst: jest.fn() },
      commissionSnapshot: { create: jest.fn(), upsert: jest.fn() },
      policyAssignment: { upsert: jest.fn(), updateMany: jest.fn() },
      $transaction: jest.fn((callback: (tx: any) => any) =>
        callback({
          policy: { update: jest.fn().mockImplementation(({ data }) => ({ id: 'pol_1', ...data })) },
          commissionSnapshot: {
            create: jest.fn().mockResolvedValue({ id: 'snap_1', totalAmount: 5000 }),
            upsert: jest.fn().mockResolvedValue({ id: 'snap_1', totalAmount: 5000 }),
          },
          policyAssignment: { upsert: jest.fn(), updateMany: jest.fn() },
        }),
      ),
    };

    gateway = {
      broadcastPolicyCreated: jest.fn(),
      broadcastPolicyClaimed: jest.fn(),
      broadcastPolicyReleased: jest.fn(),
      broadcastPolicyCompleted: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliciesService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: PoliciesGateway,
          useValue: gateway,
        },
      ],
    }).compile();

    service = module.get<PoliciesService>(PoliciesService);
  });

  describe('Claim Policy (Concurrency & Race Condition)', () => {
    it('should successfully claim an UNASSIGNED policy and broadcast event', async () => {
      prisma.policy.findUnique.mockResolvedValue({
        id: 'pol_1',
        branchId: 'branch_abc',
        state: PolicyState.UNASSIGNED,
        brokerId: null,
      });

      const result = await service.claim('pol_1', mockBrokerUser);

      expect(result).toBeDefined();
      expect(gateway.broadcastPolicyClaimed).toHaveBeenCalledWith(
        'pol_1',
        mockBrokerUser.userId,
      );
    });

    it('should reject claim attempt with ConflictException if policy is already claimed by another broker (Race condition prevention)', async () => {
      prisma.policy.findUnique.mockResolvedValue({
        id: 'pol_1',
        branchId: 'branch_abc',
        state: PolicyState.CLAIMED,
        brokerId: mockOtherBrokerUser.userId,
      });

      // Broker B tries to claim simultaneously:
      await expect(
        service.claim('pol_1', mockBrokerUser),
      ).rejects.toThrow(ConflictException);

      expect(gateway.broadcastPolicyClaimed).not.toHaveBeenCalled();
    });
  });

  describe('Release Policy', () => {
    it('should allow the owner broker to release policy back to UNASSIGNED and broadcast', async () => {
      prisma.policy.findUnique.mockResolvedValue({
        id: 'pol_1',
        branchId: 'branch_abc',
        state: PolicyState.CLAIMED,
        brokerId: mockBrokerUser.userId,
      });

      const result = await service.release('pol_1', { reason: 'Müşteriye ulaşılamadı' }, mockBrokerUser);

      expect(result).toBeDefined();
      expect(gateway.broadcastPolicyReleased).toHaveBeenCalledWith('pol_1');
    });

    it('should prevent non-owner broker from releasing another broker’s claimed policy', async () => {
      prisma.policy.findUnique.mockResolvedValue({
        id: 'pol_1',
        branchId: 'branch_abc',
        state: PolicyState.CLAIMED,
        brokerId: mockOtherBrokerUser.userId,
      });

      await expect(
        service.release('pol_1', {}, mockBrokerUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Complete Policy (FSM Lifecycle)', () => {
    it('should complete claimed policy, calculate commission snapshot, and broadcast', async () => {
      prisma.policy.findUnique.mockResolvedValue({
        id: 'pol_1',
        branchId: 'branch_abc',
        state: PolicyState.CLAIMED,
        brokerId: mockBrokerUser.userId,
      });

      prisma.commissionRule.findFirst.mockResolvedValue({
        id: 'rule_1',
        companyShare: 40,
        agencyShare: 30,
        branchShare: 20,
        brokerShare: 10,
      });

      const result = await service.complete(
        'pol_1',
        { totalAmount: 5000 },
        mockBrokerUser,
      );

      expect(result).toBeDefined();
      expect(gateway.broadcastPolicyCompleted).toHaveBeenCalledWith('pol_1');
    });
  });
});
