import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserRole } from '@prisma/client';

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getSummaryStats: jest.fn().mockResolvedValue({
              policiesByState: [],
              counters: { totalPolicies: 10 },
              financials: { totalPremium: 5000 },
              recentActivities: [],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return summary', async () => {
    const user = {
      userId: 'user1',
      email: 'admin@insurahub.com',
      role: UserRole.SUPERADMIN,
    };
    const result = await controller.getSummary(user);
    expect(result).toBeDefined();
    expect(result.data.counters.totalPolicies).toBe(10);
  });
});
