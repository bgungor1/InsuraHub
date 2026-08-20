import { UserRole } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { TicketScopeHelper } from './ticket-scope.helper';

describe('TicketScopeHelper', () => {
  const mockAgency = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  };

  const mockBranch = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  };

  const mockUser = {
    findMany: jest.fn(),
  };

  const mockPrisma = {
    agency: mockAgency,
    branch: mockBranch,
    user: mockUser,
  } as unknown as PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getScopedUserIds', () => {
    it('returns null for SUPERADMIN', async () => {
      const result = await TicketScopeHelper.getScopedUserIds(mockPrisma, {
        userId: 'u1',
        email: 'admin@test.com',
        role: UserRole.SUPERADMIN,
      });
      expect(result).toBeNull();
    });

    it('returns scoped user ids for COMPANY_USER', async () => {
      mockAgency.findMany.mockResolvedValue([{ id: 'agency-1' }]);
      mockBranch.findMany.mockResolvedValue([{ id: 'branch-1' }]);
      mockUser.findMany.mockResolvedValue([{ id: 'u1' }, { id: 'u2' }]);

      const result = await TicketScopeHelper.getScopedUserIds(mockPrisma, {
        userId: 'u1',
        email: 'comp@test.com',
        role: UserRole.COMPANY_USER,
        companyId: 'comp-1',
      });

      expect(result).toEqual(['u1', 'u2']);
      expect(mockAgency.findMany).toHaveBeenCalledWith({
        where: { companyId: 'comp-1' },
        select: { id: true },
      });
    });

    it('returns fallback creator user id when no company is linked', async () => {
      const result = await TicketScopeHelper.getScopedUserIds(mockPrisma, {
        userId: 'broker-1',
        email: 'broker@test.com',
        role: UserRole.BROKER,
      });

      expect(result).toEqual(['broker-1']);
    });
  });
});
