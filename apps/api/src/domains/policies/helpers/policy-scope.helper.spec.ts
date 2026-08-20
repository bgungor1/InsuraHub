import { ForbiddenException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PolicyScopeHelper } from './policy-scope.helper';

describe('PolicyScopeHelper (RBAC & Multi-Tenant Scoping)', () => {
  it('should allow SUPERADMIN unrestricted access', () => {
    const where: Prisma.PolicyWhereInput = {};
    PolicyScopeHelper.applyOrganizationalScope(where, {
      userId: 'admin_1',
      role: UserRole.SUPERADMIN,
      email: 'admin@insurahub.com',
    });

    expect(where).toEqual({});
  });

  it('should scope AGENCY_MANAGER queries to the agency branches', () => {
    const where: Prisma.PolicyWhereInput = {};
    PolicyScopeHelper.applyOrganizationalScope(where, {
      userId: 'agency_mgr',
      role: UserRole.AGENCY_MANAGER,
      agencyId: 'agency_123',
      email: 'agency@insurahub.com',
    });

    expect(where.branch).toEqual({ agencyId: 'agency_123' });
  });

  it('should scope BRANCH_MANAGER and BROKER queries to their branchId', () => {
    const where: Prisma.PolicyWhereInput = {};
    PolicyScopeHelper.applyOrganizationalScope(where, {
      userId: 'broker_1',
      role: UserRole.BROKER,
      branchId: 'branch_789',
      email: 'broker@insurahub.com',
    });

    expect(where.branchId).toBe('branch_789');
  });

  it('should resolve selected branchId for AGENCY_MANAGER', () => {
    const user = {
      userId: 'agency_mgr',
      role: UserRole.AGENCY_MANAGER,
      agencyId: 'agency_123',
      email: 'agency@insurahub.com',
    };

    const resolved = PolicyScopeHelper.resolveBranchId('branch_selected', user);
    expect(resolved).toBe('branch_selected');
  });

  it('should throw ForbiddenException if broker attempts to access a policy from a different branch', () => {
    const policy = { branchId: 'branch_A' };
    const user = {
      userId: 'broker_B',
      role: UserRole.BROKER,
      branchId: 'branch_B',
      email: 'broker@insurahub.com',
    };

    expect(() => PolicyScopeHelper.verifyPolicyScope(policy, user)).toThrow(
      ForbiddenException,
    );
  });
});
