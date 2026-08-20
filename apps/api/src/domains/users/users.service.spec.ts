import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/decorators';
import { QueryUserDto } from './dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    branch: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should include hierarchical conditions for COMPANY_USER', async () => {
    const query = Object.assign(new QueryUserDto(), { role: UserRole.BROKER });
    const currentUser: AuthenticatedUser = {
      userId: 'u1',
      email: 'sirket@insurahub.com',
      role: UserRole.COMPANY_USER,
      companyId: 'comp_1',
    };

    await service.findAll(query, currentUser);

    expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            {
              OR: [
                { companyId: 'comp_1' },
                { agency: { companyId: 'comp_1' } },
                { branch: { agency: { companyId: 'comp_1' } } },
              ],
            },
            { role: UserRole.BROKER },
          ]),
        }),
      }),
    );
  });
});
