import { ConflictException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../../auth/decorators';

export class TicketScopeHelper {
  static async getScopedUserIds(
    prisma: PrismaService,
    user: AuthenticatedUser,
  ): Promise<string[] | null> {
    if (user.role === UserRole.SUPERADMIN) return null;

    const companyId = await this.resolveEffectiveCompanyId(prisma, user);
    if (companyId) {
      const agencies = await prisma.agency.findMany({
        where: { companyId },
        select: { id: true },
      });
      const agencyIds = agencies.map((a) => a.id);

      const branches = await prisma.branch.findMany({
        where: { agencyId: { in: agencyIds } },
        select: { id: true },
      });
      const branchIds = branches.map((b) => b.id);

      const users = await prisma.user.findMany({
        where: {
          OR: [
            { companyId },
            { agencyId: { in: agencyIds } },
            { branchId: { in: branchIds } },
          ],
        },
        select: { id: true },
      });
      return users.map((u) => u.id);
    }

    if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      const branches = await prisma.branch.findMany({
        where: { agencyId: user.agencyId },
        select: { id: true },
      });
      const branchIds = branches.map((b) => b.id);

      const users = await prisma.user.findMany({
        where: {
          OR: [{ agencyId: user.agencyId }, { branchId: { in: branchIds } }],
        },
        select: { id: true },
      });
      return users.map((u) => u.id);
    }

    if (user.branchId) {
      const users = await prisma.user.findMany({
        where: { branchId: user.branchId },
        select: { id: true },
      });
      return users.map((u) => u.id);
    }

    return [user.userId];
  }

  static async resolveEffectiveCompanyId(
    prisma: PrismaService,
    user: AuthenticatedUser,
  ): Promise<string | null> {
    if (user.companyId) return user.companyId;
    if (user.agencyId) {
      const agency = await prisma.agency.findUnique({
        where: { id: user.agencyId },
        select: { companyId: true },
      });
      if (agency?.companyId) return agency.companyId;
    }
    if (user.branchId) {
      const branch = await prisma.branch.findUnique({
        where: { id: user.branchId },
        include: { agency: true },
      });
      if (branch?.agency?.companyId) return branch.agency.companyId;
    }
    return null;
  }

  static checkTicketAccess(
    ticket: {
      creatorId: string;
      creator: {
        companyId?: string | null;
        agencyId?: string | null;
        branchId?: string | null;
        agency?: { companyId?: string | null } | null;
        branch?: {
          agencyId?: string | null;
          agency?: { companyId?: string | null } | null;
        } | null;
      };
    },
    user: AuthenticatedUser,
  ): void {
    if (user.role === UserRole.SUPERADMIN || ticket.creatorId === user.userId) {
      return;
    }

    if (user.role === UserRole.COMPANY_USER && user.companyId) {
      const match =
        ticket.creator.companyId === user.companyId ||
        ticket.creator.agency?.companyId === user.companyId ||
        ticket.creator.branch?.agency?.companyId === user.companyId;

      if (!match) {
        throw new ConflictException(
          'Bu destek talebini görüntüleme yetkiniz yok.',
        );
      }
      return;
    }

    if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      const match =
        ticket.creator.agencyId === user.agencyId ||
        ticket.creator.branch?.agencyId === user.agencyId;

      if (!match) {
        throw new ConflictException(
          'Bu destek talebini görüntüleme yetkiniz yok.',
        );
      }
      return;
    }

    if (
      (user.role === UserRole.BRANCH_MANAGER ||
        user.role === UserRole.BROKER) &&
      user.branchId
    ) {
      if (ticket.creator.branchId === user.branchId) return;

      const ticketCompanyId =
        ticket.creator.companyId ||
        ticket.creator.agency?.companyId ||
        ticket.creator.branch?.agency?.companyId;

      if (
        user.companyId &&
        ticketCompanyId &&
        user.companyId === ticketCompanyId
      ) {
        return;
      }
    }

    throw new ConflictException('Bu destek talebini görüntüleme yetkiniz yok.');
  }
}
