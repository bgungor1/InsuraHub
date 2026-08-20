import { Prisma, UserRole } from '@prisma/client';
import type { AuthenticatedUser } from '../../../auth/decorators';
import { QueryPolicyDto } from '../dto';
import { PolicyScopeHelper } from './policy-scope.helper';

export class PolicyQueryHelper {
  static buildWhereClause(
    query: QueryPolicyDto,
    user: AuthenticatedUser,
  ): Prisma.PolicyWhereInput {
    const { search, state, customerId, branchId, brokerId, product } = query;
    const where: Prisma.PolicyWhereInput = {};

    PolicyScopeHelper.applyOrganizationalScope(where, user);

    if (state) where.state = state;
    if (customerId) where.customerId = customerId;
    if (branchId && user.role === UserRole.SUPERADMIN) {
      where.branchId = branchId;
    }
    if (brokerId) where.brokerId = brokerId;
    if (product) where.product = { contains: product, mode: 'insensitive' };

    if (search) {
      where.OR = [
        { product: { contains: search, mode: 'insensitive' } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
        { customer: { identityNo: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return where;
  }

  static getFindAllIncludes(): Prisma.PolicyInclude {
    return {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          identityNo: true,
        },
      },
      branch: { select: { id: true, name: true } },
      broker: { select: { id: true, firstName: true, lastName: true } },
      snapshot: {
        select: {
          id: true,
          totalAmount: true,
          brokerAmount: true,
          branchAmount: true,
          agencyAmount: true,
          companyAmount: true,
        },
      },
    };
  }

  static getFindOneIncludes(): Prisma.PolicyInclude {
    return {
      customer: true,
      branch: { include: { agency: { include: { company: true } } } },
      broker: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      assignment: {
        include: {
          claimedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
      snapshot: { include: { rule: true } },
      previousPolicy: true,
      renewals: true,
    };
  }
}
