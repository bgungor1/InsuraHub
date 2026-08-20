import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

export interface LogActionParams {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
}

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: LogActionParams) {
    return this.prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        before: params.before
          ? (JSON.parse(JSON.stringify(params.before)) as Prisma.InputJsonValue)
          : undefined,
        after: params.after
          ? (JSON.parse(JSON.stringify(params.after)) as Prisma.InputJsonValue)
          : undefined,
      },
    });
  }

  async findAll(query: QueryAuditLogDto) {
    const {
      skip,
      take,
      actorId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
    } = query;
    const where: Prisma.AuditLogWhereInput = {};

    if (actorId) where.actorId = actorId;
    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [rawItems, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    const actorIds = Array.from(new Set(rawItems.map((item) => item.actorId)));
    const users = await this.prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const items = rawItems.map((item) => ({
      ...item,
      actor: userMap.get(item.actorId) || null,
    }));

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
}
