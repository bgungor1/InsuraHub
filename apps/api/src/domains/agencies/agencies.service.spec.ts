import { Test, TestingModule } from '@nestjs/testing';
import { AgenciesService } from './agencies.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AgenciesService', () => {
  let service: AgenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgenciesService,
        {
          provide: PrismaService,
          useValue: {
            agency: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
            company: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AgenciesService>(AgenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
