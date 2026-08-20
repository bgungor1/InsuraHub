import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsService } from './audit-logs.service';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryAuditLogDto } from './dto';

describe('AuditLogsService', () => {
  let service: AuditLogsService;

  const mockPrisma = {
    auditLog: {
      create: jest
        .fn()
        .mockResolvedValue({ id: 'log1', action: 'CREATE_POLICY' }),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'log1',
          actorId: 'user1',
          action: 'CREATE_POLICY',
          entityType: 'POLICY',
          entityId: 'pol1',
        },
      ]),
      count: jest.fn().mockResolvedValue(1),
    },
    user: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'user1',
          firstName: 'Ahmet',
          lastName: 'Güneş',
          email: 'ahmet@gunes.com',
          role: 'SUPERADMIN',
        },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log an action successfully', async () => {
    const res = await service.logAction({
      actorId: 'user1',
      action: 'CREATE_POLICY',
      entityType: 'POLICY',
      entityId: 'pol1',
    });
    expect(res).toBeDefined();
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
  });

  it('should findAll and enrich actor details', async () => {
    const query = new QueryAuditLogDto();
    const res = await service.findAll(query);
    expect(res.items).toHaveLength(1);
    expect(res.items[0].actor?.firstName).toBe('Ahmet');
    expect(res.total).toBe(1);
  });
});
