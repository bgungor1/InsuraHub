import { PolicyState, UserRole } from '@prisma/client';
import { PolicyQueryHelper } from './policy-query.helper';
import { QueryPolicyDto } from '../dto';

describe('PolicyQueryHelper', () => {
  it('should build where clause for search and filters for SUPERADMIN', () => {
    const query = Object.assign(new QueryPolicyDto(), {
      state: PolicyState.UNASSIGNED,
      search: 'Kasko',
      branchId: 'branch_1',
    });

    const user = {
      userId: 'admin_1',
      role: UserRole.SUPERADMIN,
      email: 'admin@insurahub.com',
    };

    const where = PolicyQueryHelper.buildWhereClause(query, user);

    expect(where.state).toBe(PolicyState.UNASSIGNED);
    expect(where.branchId).toBe('branch_1');
    expect(where.OR).toBeDefined();
    expect(where.OR?.length).toBe(4);
  });

  it('should provide find all includes with customer and broker selects', () => {
    const includes = PolicyQueryHelper.getFindAllIncludes();
    expect(includes.customer).toBeDefined();
    expect(includes.branch).toBeDefined();
    expect(includes.broker).toBeDefined();
    expect(includes.snapshot).toBeDefined();
  });

  it('should provide detailed find one includes with assignment and renewals', () => {
    const includes = PolicyQueryHelper.getFindOneIncludes();
    expect(includes.assignment).toBeDefined();
    expect(includes.renewals).toBeDefined();
    expect(includes.previousPolicy).toBeDefined();
  });
});
