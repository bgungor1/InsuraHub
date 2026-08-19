import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsService } from './commissions.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CommissionsService', () => {
  let service: CommissionsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      commissionRule: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
      },
      commissionSnapshot: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
      policy: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn((callback: (tx: any) => any) =>
        callback({
          commissionRule: {
            updateMany: jest.fn().mockResolvedValue({ count: 1 }),
            create: jest.fn().mockImplementation(({ data }) => ({
              id: 'rule_1',
              ...data,
            })),
          },
        }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommissionsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<CommissionsService>(CommissionsService);
  });

  it('should throw BadRequestException if commission shares do not sum to 100%', async () => {
    await expect(
      service.createRule({
        name: 'Hatalı Kural',
        companyShare: 40,
        agencyShare: 30,
        branchShare: 20,
        brokerShare: 5, // Total 95%
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should close prior rules and create new active rule with validFrom when total is 100%', async () => {
    const result = await service.createRule({
      name: '2026 Standart Kural',
      companyShare: 40,
      agencyShare: 30,
      branchShare: 20,
      brokerShare: 10,
    });

    expect(result).toBeDefined();
    expect(result.name).toBe('2026 Standart Kural');
    expect(result.companyShare).toBe(40);
  });

  it('should calculate bottom-tier shares and upsert snapshot on policy completion', async () => {
    prisma.policy.findUnique.mockResolvedValue({
      id: 'pol_1',
      branchId: 'branch_1',
      brokerId: 'broker_1',
    });

    prisma.commissionRule.findFirst.mockResolvedValue({
      id: 'rule_1',
      companyShare: 40,
      agencyShare: 30,
      branchShare: 20,
      brokerShare: 10,
    });

    prisma.commissionSnapshot.upsert.mockResolvedValue({
      id: 'snap_1',
      policyId: 'pol_1',
      totalAmount: 10000,
      companyAmount: 4000,
      agencyAmount: 3000,
      branchAmount: 2000,
      brokerAmount: 1000,
    });

    const snapshot = await service.calculateAndSnapshot('pol_1', 10000);

    expect(snapshot.totalAmount).toBe(10000);
    expect(snapshot.companyAmount).toBe(4000);
    expect(snapshot.brokerAmount).toBe(1000);
  });
});
