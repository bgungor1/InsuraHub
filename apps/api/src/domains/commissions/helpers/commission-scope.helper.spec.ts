import { ConflictException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CommissionScopeHelper } from './commission-scope.helper';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueryCommissionDto } from '../dto';

describe('CommissionScopeHelper', () => {
  const mockPolicy = {
    findMany: jest.fn(),
  };

  const mockPrisma = {
    policy: mockPolicy,
  } as unknown as PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildSnapshotWhere', () => {
    it('should scope snapshots for COMPANY_USER', async () => {
      mockPolicy.findMany.mockResolvedValue([{ id: 'pol_1' }, { id: 'pol_2' }]);

      const query = Object.assign(new QueryCommissionDto(), {});
      const user = {
        userId: 'u_comp',
        role: UserRole.COMPANY_USER,
        companyId: 'comp_1',
        email: 'comp@insurahub.com',
      };

      const where = await CommissionScopeHelper.buildSnapshotWhere(
        mockPrisma,
        query,
        user,
      );

      expect(where.policyId).toEqual({ in: ['pol_1', 'pol_2'] });
    });

    it('should scope snapshots for BROKER to user policies', async () => {
      const query = Object.assign(new QueryCommissionDto(), {});
      const user = {
        userId: 'broker_1',
        role: UserRole.BROKER,
        email: 'broker@insurahub.com',
      };

      const where = await CommissionScopeHelper.buildSnapshotWhere(
        mockPrisma,
        query,
        user,
      );

      expect(where.policy).toEqual({ brokerId: 'broker_1' });
    });
  });

  describe('verifySnapshotAccess', () => {
    const mockSnapshot = {
      policy: {
        brokerId: 'broker_1',
        branchId: 'branch_1',
        branch: {
          agencyId: 'agency_1',
          agency: {
            companyId: 'company_1',
          },
        },
      },
    };

    it('should allow SUPERADMIN access unconditionally', () => {
      expect(() =>
        CommissionScopeHelper.verifySnapshotAccess(mockSnapshot, {
          userId: 'admin_1',
          role: UserRole.SUPERADMIN,
          email: 'admin@insurahub.com',
        }),
      ).not.toThrow();
    });

    it('should throw ConflictException if broker does not own the snapshot policy', () => {
      expect(() =>
        CommissionScopeHelper.verifySnapshotAccess(mockSnapshot, {
          userId: 'other_broker',
          role: UserRole.BROKER,
          email: 'other@insurahub.com',
        }),
      ).toThrow(ConflictException);
    });

    it('should allow owner broker to access snapshot', () => {
      expect(() =>
        CommissionScopeHelper.verifySnapshotAccess(mockSnapshot, {
          userId: 'broker_1',
          role: UserRole.BROKER,
          email: 'broker@insurahub.com',
        }),
      ).not.toThrow();
    });
  });
});
