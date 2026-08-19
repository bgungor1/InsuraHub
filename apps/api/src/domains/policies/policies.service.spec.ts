import { Test, TestingModule } from '@nestjs/testing';
import { PoliciesService } from './policies.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PoliciesGateway } from './policies.gateway';

describe('PoliciesService', () => {
  let service: PoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliciesService,
        {
          provide: PrismaService,
          useValue: {
            policy: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            customer: { findUnique: jest.fn() },
            branch: { findUnique: jest.fn() },
            commissionRule: { findFirst: jest.fn() },
            commissionSnapshot: { create: jest.fn() },
            policyAssignment: { upsert: jest.fn(), updateMany: jest.fn() },
            $transaction: jest.fn((callback: (tx: unknown) => unknown) =>
              callback({
                policy: { update: jest.fn() },
                commissionSnapshot: { create: jest.fn() },
                policyAssignment: { upsert: jest.fn(), updateMany: jest.fn() },
              }),
            ),
          },
        },
        {
          provide: PoliciesGateway,
          useValue: {
            broadcastPolicyCreated: jest.fn(),
            broadcastPolicyClaimed: jest.fn(),
            broadcastPolicyReleased: jest.fn(),
            broadcastPolicyCompleted: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PoliciesService>(PoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
