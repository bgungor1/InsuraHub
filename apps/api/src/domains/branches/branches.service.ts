import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../../auth/strategies';
import { CreateBranchDto, QueryBranchDto, UpdateBranchDto } from './dto';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBranchDto, user: AuthenticatedUser) {
    const agency = await this.prisma.agency.findUnique({
      where: { id: dto.agencyId },
      select: { id: true, companyId: true },
    });
    if (!agency)
      throw new NotFoundException('Bağlanmaya çalışılan acente bulunamadı.');

    if (
      user.role === UserRole.COMPANY_USER &&
      agency.companyId !== user.companyId
    ) {
      throw new ForbiddenException(
        'Yalnızca kendi şirketinize ait acentelerde şube oluşturabilirsiniz.',
      );
    }
    if (user.role === UserRole.AGENCY_MANAGER && agency.id !== user.agencyId) {
      throw new ForbiddenException(
        'Yalnızca kendi acentenize ait şube oluşturabilirsiniz.',
      );
    }

    const existing = await this.prisma.branch.findUnique({
      where: { name_agencyId: { name: dto.name, agencyId: dto.agencyId } },
    });
    if (existing)
      throw new ConflictException(
        'Bu acenteye ait aynı isimde bir şube zaten mevcut.',
      );

    return this.prisma.branch.create({
      data: dto,
      include: {
        agency: {
          select: {
            id: true,
            name: true,
            company: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async findAll(query: QueryBranchDto, user: AuthenticatedUser) {
    const { skip, take, search, isActive } = query;
    const where: Prisma.BranchWhereInput = {};

    if (user.role === UserRole.COMPANY_USER) {
      where.agency = { companyId: user.companyId };
    } else if (user.role === UserRole.AGENCY_MANAGER) {
      where.agencyId = user.agencyId;
    } else if (user.role === UserRole.BRANCH_MANAGER) {
      where.id = user.branchId;
    } else {
      if (query.agencyId) where.agencyId = query.agencyId;
      if (query.companyId) where.agency = { companyId: query.companyId };
    }

    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.branch.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          agency: {
            select: {
              id: true,
              name: true,
              company: { select: { id: true, name: true } },
            },
          },
          _count: { select: { users: true, policies: true } },
        },
      }),
      this.prisma.branch.count({ where }),
    ]);

    const limit = query.limit ?? 10;
    return {
      items,
      total,
      page: query.page ?? 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        agency: {
          select: {
            id: true,
            name: true,
            company: { select: { id: true, name: true } },
          },
        },
        _count: { select: { users: true, policies: true } },
      },
    });
    if (!branch) throw new NotFoundException('Şube bulunamadı.');

    if (
      user.role === UserRole.COMPANY_USER &&
      branch.agency.company.id !== user.companyId
    ) {
      throw new ForbiddenException('Bu şubeye erişim yetkiniz yok.');
    }
    if (
      user.role === UserRole.AGENCY_MANAGER &&
      branch.agencyId !== user.agencyId
    ) {
      throw new ForbiddenException(
        'Yalnızca kendi acentenize ait şubelere erişebilirsiniz.',
      );
    }
    if (user.role === UserRole.BRANCH_MANAGER && branch.id !== user.branchId) {
      throw new ForbiddenException('Yalnızca kendi şubenize erişebilirsiniz.');
    }

    return branch;
  }

  async update(id: string, dto: UpdateBranchDto, user: AuthenticatedUser) {
    const branch = await this.findOne(id, user);

    if (dto.name && dto.name !== branch.name) {
      const targetAgencyId = dto.agencyId || branch.agencyId;
      const duplicate = await this.prisma.branch.findFirst({
        where: { name: dto.name, agencyId: targetAgencyId, NOT: { id } },
      });
      if (duplicate)
        throw new ConflictException(
          'Bu acenteye ait aynı isimde başka bir şube zaten mevcut.',
        );
    }

    return this.prisma.branch.update({
      where: { id },
      data: dto,
      include: { agency: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    await this.findOne(id, user);
    return this.prisma.branch.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
