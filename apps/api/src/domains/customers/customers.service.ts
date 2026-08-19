import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/decorators';
import { CreateCustomerDto, QueryCustomerDto, UpdateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    const existing = await this.prisma.customer.findUnique({
      where: { identityNo: dto.identityNo },
    });
    if (existing) {
      throw new ConflictException(
        'Bu kimlik/vergi numarasına (TCKN/VKN) sahip müşteri zaten kayıtlı.',
      );
    }

    const { firstName, lastName, identityNo, ...contactFields } = dto;

    return this.prisma.customer.create({
      data: {
        firstName,
        lastName,
        identityNo,
        contactInfo: contactFields,
      },
    });
  }

  async findAll(query: QueryCustomerDto, currentUser: AuthenticatedUser) {
    const { skip, take, search, identityNo } = query;
    const where: Prisma.CustomerWhereInput = {};

    if (identityNo) {
      where.identityNo = identityNo;
    } else if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { identityNo: { contains: search, mode: 'insensitive' } },
      ];
    } else {
      this.applyOrganizationalScope(where, currentUser);
    }

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { policies: true },
          },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByIdentityNo(identityNo: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { identityNo },
      include: {
        _count: {
          select: { policies: true },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(
        'Belirtilen kimlik numaralı müşteri bulunamadı.',
      );
    }

    return customer;
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        policies: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            branch: {
              select: { id: true, name: true },
            },
            broker: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: { policies: true },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Müşteri bulunamadı.');
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    if (dto.identityNo && dto.identityNo !== customer.identityNo) {
      const conflict = await this.prisma.customer.findUnique({
        where: { identityNo: dto.identityNo },
      });
      if (conflict) {
        throw new ConflictException(
          'Bu kimlik/vergi numarasına sahip başka bir müşteri zaten mevcut.',
        );
      }
    }

    const existingContact =
      typeof customer.contactInfo === 'object' && customer.contactInfo !== null
        ? (customer.contactInfo as Record<string, unknown>)
        : {};

    const updatedContact = {
      ...existingContact,
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.district !== undefined && { district: dto.district }),
    };

    return this.prisma.customer.update({
      where: { id },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.identityNo && { identityNo: dto.identityNo }),
        contactInfo: updatedContact,
      },
    });
  }

  async remove(id: string) {
    const customer = await this.findOne(id);

    const policyCount = await this.prisma.policy.count({
      where: { customerId: id },
    });

    if (policyCount > 0) {
      throw new ConflictException(
        'Poliçesi bulunan bir müşteri sistemden silinemez.',
      );
    }

    return this.prisma.customer.delete({
      where: { id: customer.id },
    });
  }

  private applyOrganizationalScope(
    where: Prisma.CustomerWhereInput,
    user: AuthenticatedUser,
  ) {
    if (user.role === UserRole.SUPERADMIN) return;

    if (user.role === UserRole.COMPANY_USER && user.companyId) {
      where.policies = {
        some: {
          branch: {
            agency: {
              companyId: user.companyId,
            },
          },
        },
      };
    } else if (user.role === UserRole.AGENCY_MANAGER && user.agencyId) {
      where.policies = {
        some: {
          branch: {
            agencyId: user.agencyId,
          },
        },
      };
    } else if (
      (user.role === UserRole.BRANCH_MANAGER ||
        user.role === UserRole.BROKER) &&
      user.branchId
    ) {
      where.policies = {
        some: {
          branchId: user.branchId,
        },
      };
    }
  }
}
