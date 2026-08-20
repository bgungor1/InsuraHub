import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import type { AuthenticatedUser } from '../../../auth/decorators';

export class PolicyScopeHelper {
  static resolveBranchId(
    branchId: string | undefined,
    user: AuthenticatedUser,
  ): string {
    if (
      user.role === UserRole.SUPERADMIN ||
      user.role === UserRole.COMPANY_USER ||
      user.role === UserRole.AGENCY_MANAGER
    ) {
      if (!branchId) throw new ConflictException('Şube seçimi zorunludur.');
      return branchId;
    }
    if (user.branchId) return user.branchId;
    if (branchId) return branchId;
    throw new ForbiddenException(
      'Kullanıcının bağlı olduğu bir şube bulunmamaktadır.',
    );
  }

  static applyOrganizationalScope(
    where: Prisma.PolicyWhereInput,
    user: AuthenticatedUser,
  ): void {
    if (user.role === UserRole.SUPERADMIN) return;
    if (user.role === UserRole.COMPANY_USER && user.companyId) {
      where.branch = { agency: { companyId: user.companyId } };
    } else if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      where.branch = { agencyId: user.agencyId };
    } else if (
      (user.role === UserRole.BRANCH_MANAGER ||
        user.role === UserRole.BROKER) &&
      user.branchId
    ) {
      where.branchId = user.branchId;
    }
  }

  static verifyPolicyScope(
    policy: { branchId: string },
    user: AuthenticatedUser,
  ): void {
    if (user.role === UserRole.SUPERADMIN) return;
    if (
      (user.role === UserRole.BRANCH_MANAGER ||
        user.role === UserRole.BROKER) &&
      policy.branchId !== user.branchId
    ) {
      throw new ForbiddenException(
        'Bu poliçeye erişim yetkiniz bulunmamaktadır.',
      );
    }
  }
}
