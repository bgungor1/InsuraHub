import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsService } from './commissions.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CommissionsService', () => {
  let service: CommissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommissionsService,
        {
          provide: PrismaService,
          useValue: {
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
            $transaction: jest.fn((callback: (tx: unknown) => unknown) =>
              callback({
                commissionRule: {
                  updateMany: jest.fn(),
                  create: jest.fn(),
                },
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<CommissionsService>(CommissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
