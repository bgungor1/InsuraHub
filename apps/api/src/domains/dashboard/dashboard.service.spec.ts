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

  it('should return summary stats for superadmin with full breakdown', async () => {
    const user = {
      userId: 'user1',
      email: 'admin@insurahub.com',
      role: UserRole.SUPERADMIN,
    };

    const stats = await service.getSummaryStats(user);
    expect(stats).toBeDefined();
    expect(stats.financials.totalPremium).toBe(100000);
    expect(stats.financials.commissions.company).toBe(40000);
    expect(stats.financials.commissions.agency).toBe(20000);
    expect(stats.financials.commissions.branch).toBe(20000);
    expect(stats.financials.commissions.broker).toBe(20000);
    expect(stats.counters.totalCustomers).toBe(50);
  });

  it('should mask company/agency/branch shares for broker', async () => {
    const user = {
      userId: 'broker1',
      email: 'broker1@insurahub.com',
      role: UserRole.BROKER,
      branchId: 'branch1',
    };

    const stats = await service.getSummaryStats(user);
    expect(stats).toBeDefined();
    expect(stats.financials.commissions.company).toBe(0);
    expect(stats.financials.commissions.agency).toBe(0);
    expect(stats.financials.commissions.branch).toBe(0);
    expect(stats.financials.commissions.broker).toBe(20000);
  });
});
