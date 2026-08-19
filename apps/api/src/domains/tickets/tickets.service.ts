import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TicketStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/decorators';
import { AddTicketMessageDto, CreateTicketDto, QueryTicketDto } from './dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTicketDto, user: AuthenticatedUser) {
    return this.prisma.ticket.create({
      data: {
        subject: dto.subject,
        category: dto.category,
        status: TicketStatus.OPEN,
        creatorId: user.userId,
        messages: {
          create: {
            senderId: user.userId,
            body: dto.message,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
        },
      },
    });
  }

  async findAll(query: QueryTicketDto, user: AuthenticatedUser) {
    const { skip, take, category, status, startDate, endDate } = query;
    const where: Prisma.TicketWhereInput = {};

    if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      where.creator = { branch: { agencyId: user.agencyId } };
    } else if (user.role === UserRole.BRANCH_MANAGER && user.branchId) {
      where.creator = { branchId: user.branchId };
    } else if (user.role === UserRole.BROKER) {
      where.creatorId = user.userId;
    }

    if (category) where.category = category;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              branch: { select: { name: true } },
            },
          },
          _count: { select: { messages: true } },
        },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: {
          include: {
            branch: { include: { agency: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Destek talebi bulunamadı.');
    }

    this.checkTicketAccess(ticket, user);
    return ticket;
  }

  async addMessage(
    id: string,
    dto: AddTicketMessageDto,
    user: AuthenticatedUser,
  ) {
    const ticket = await this.findOne(id, user);

    const isClosed = ticket.status === TicketStatus.CLOSED;
    if (isClosed && user.role === UserRole.BROKER) {
      throw new ConflictException(
        'Kapatılmış bir destek talebine mesaj gönderilemez.',
      );
    }

    const [message] = await Promise.all([
      this.prisma.ticketMessage.create({
        data: {
          ticketId: id,
          senderId: user.userId,
          body: dto.body,
        },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, role: true },
          },
        },
      }),
      ticket.status === TicketStatus.OPEN
        ? this.prisma.ticket.update({
            where: { id },
            data: { status: TicketStatus.IN_PROGRESS },
          })
        : Promise.resolve(),
    ]);

    return message;
  }

  async updateStatus(
    id: string,
    status: TicketStatus,
    user: AuthenticatedUser,
  ) {
    const ticket = await this.findOne(id, user);

    const isResolving =
      status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED;

    return this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status,
        ...(isResolving && { resolvedAt: new Date() }),
        ...(!isResolving && { resolvedAt: null }),
      },
    });
  }

  private checkTicketAccess(
    ticket: {
      creatorId: string;
      creator: {
        branchId?: string | null;
        branch?: { agencyId?: string | null } | null;
      };
    },
    user: AuthenticatedUser,
  ) {
    if (
      user.role === UserRole.SUPERADMIN ||
      user.role === UserRole.COMPANY_USER
    ) {
      return;
    }

    if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      if (ticket.creator.branch?.agencyId !== user.agencyId) {
        throw new ConflictException(
          'Bu destek talebini görüntüleme yetkiniz yok.',
        );
      }
      return;
    }

    if (user.role === UserRole.BRANCH_MANAGER && user.branchId) {
      if (ticket.creator.branchId !== user.branchId) {
        throw new ConflictException(
          'Bu destek talebini görüntüleme yetkiniz yok.',
        );
      }
      return;
    }

    if (user.role === UserRole.BROKER && ticket.creatorId !== user.userId) {
      throw new ConflictException(
        'Bu destek talebini görüntüleme yetkiniz yok.',
      );
    }
  }
}
