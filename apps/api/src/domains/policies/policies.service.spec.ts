import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PolicyState, Prisma, UserRole } from '@prisma/client';
import { PoliciesService } from './policies.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PoliciesGateway } from './policies.gateway';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('PoliciesService (State Machine & Concurrency)', () => {
  let service: PoliciesService;

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

  const mockPrisma = {
    policy: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    customer: { findUnique: jest.fn() },
    branch: { findUnique: jest.fn() },
    user: { findMany: jest.fn().mockResolvedValue([{ id: 'broker_123' }]) },
    commissionRule: { findFirst: jest.fn() },
    commissionSnapshot: { create: jest.fn(), upsert: jest.fn() },
    policyAssignment: {
      upsert: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(
      (callback: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        callback({
          policy: {
            update: jest
              .fn()
              .mockImplementation(
                ({ data }: { data: Record<string, unknown> }) => ({
                  id: 'pol_1',
                  ...data,
                }),
              ),
          },
          commissionSnapshot: {
            create: jest
              .fn()
              .mockResolvedValue({ id: 'snap_1', totalAmount: 5000 }),
            upsert: jest
              .fn()
              .mockResolvedValue({ id: 'snap_1', totalAmount: 5000 }),
          },
          policyAssignment: { upsert: jest.fn(), updateMany: jest.fn() },
        } as unknown as Prisma.TransactionClient),
    ),
  };

  const mockGateway = {
    broadcastPolicyCreated: jest.fn(),
    broadcastPolicyClaimed: jest.fn(),
    broadcastPolicyReleased: jest.fn(),
    broadcastPolicyCompleted: jest.fn(),
  };

  const mockAuditLogsService = {
    logAction: jest.fn().mockResolvedValue({ id: 'log1' }),
  };

  const mockNotificationsService = {
    create: jest.fn().mockResolvedValue({ id: 'notif_1' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliciesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: PoliciesGateway,
          useValue: mockGateway,
        },
        {
          provide: AuditLogsService,
          useValue: mockAuditLogsService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<PoliciesService>(PoliciesService);
  });

  describe('Claim Policy (Concurrency & Race Condition)', () => {
    it('should successfully claim an UNASSIGNED policy and broadcast event', async () => {
      mockPrisma.policy.findUnique.mockResolvedValue({
        id: 'pol_1',
        branchId: 'branch_abc',
        state: PolicyState.UNASSIGNED,
        brokerId: null,
      });

      const result = await service.claim('pol_1', mockBrokerUser);

      expect(result).toBeDefined();
      expect(mockGateway.broadcastPolicyClaimed).toHaveBeenCalledWith(
        'pol_1',
        mockBrokerUser.userId,
      );
      expect(mockAuditLogsService.logAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CLAIM_POLICY' }),
      );
    });

    it('should reject claim attempt with ConflictException if policy is already claimed by another broker (Race condition prevention)', async () => {
      mockPrisma.policy.findUnique.mockResolvedValue({
        id: 'pol_1',
        branchId: 'branch_abc',
        state: PolicyState.CLAIMED,
        brokerId: mockOtherBrokerUser.userId,
      });

      await expect(service.claim('pol_1', mockBrokerUser)).rejects.toThrow(
        ConflictException,
      );

      expect(mockGateway.broadcastPolicyClaimed).not.toHaveBeenCalled();
    });
  });

  describe('Release Policy', () => {
    it('should allow the owner broker to release policy back to UNASSIGNED and broadcast', async () => {
      mockPrisma.policy.findUnique.mockResolvedValue({
        id: 'pol_1',
        branchId: 'branch_abc',
        state: PolicyState.CLAIMED,
        brokerId: mockBrokerUser.userId,
      });

      const result = await service.release(
        'pol_1',
        { reason: 'Müşteriye ulaşılamadı' },
        mockBrokerUser,
      );

      expect(result).toBeDefined();
      expect(mockGateway.broadcastPolicyReleased).toHaveBeenCalledWith('pol_1');
      expect(mockAuditLogsService.logAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'RELEASE_POLICY' }),
      );
    });

    it('should prevent non-owner broker from releasing another broker’s claimed policy', async () => {
      mockPrisma.policy.findUnique.mockResolvedValue({
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
      mockPrisma.policy.findUnique.mockResolvedValue({
        id: 'pol_1',
        branchId: 'branch_abc',
        state: PolicyState.CLAIMED,
        brokerId: mockBrokerUser.userId,
      });

      mockPrisma.commissionRule.findFirst.mockResolvedValue({
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
      expect(mockGateway.broadcastPolicyCompleted).toHaveBeenCalledWith(
        'pol_1',
      );
      expect(mockAuditLogsService.logAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'COMPLETE_POLICY' }),
      );
    });
  });
});
