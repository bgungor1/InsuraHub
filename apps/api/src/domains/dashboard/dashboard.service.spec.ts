import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: {
            policy: {
              count: jest.fn().mockResolvedValue(10),
            },
            commissionSnapshot: {
              aggregate: jest.fn().mockResolvedValue({
                _sum: {
                  totalAmount: 100000,
                  companyAmount: 40000,
                  agencyAmount: 20000,
                  branchAmount: 20000,
                  brokerAmount: 20000,
                },
              }),
              findMany: jest.fn().mockResolvedValue([]),
            },
            customer: {
              count: jest.fn().mockResolvedValue(50),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return summary stats for superadmin', async () => {
    const user = {
      userId: 'user1',
      email: 'admin@insurahub.com',
      role: UserRole.SUPERADMIN,
    };

    const stats = await service.getSummaryStats(user);
    expect(stats).toBeDefined();
    expect(stats.financials.totalPremium).toBe(100000);
    expect(stats.counters.totalCustomers).toBe(50);
  });
});
