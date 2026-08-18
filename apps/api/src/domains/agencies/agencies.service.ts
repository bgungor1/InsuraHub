import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../../auth/strategies';
import { CreateAgencyDto, QueryAgencyDto, UpdateAgencyDto } from './dto';

@Injectable()
export class AgenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAgencyDto, user: AuthenticatedUser) {
    if (
      user.role === UserRole.COMPANY_USER &&
      user.companyId !== dto.companyId
    ) {
      throw new ForbiddenException(
        'Yalnızca kendi şirketinize ait acente oluşturabilirsiniz.',
      );
    }

    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });
    if (!company)
      throw new NotFoundException('Bağlanmaya çalışılan şirket bulunamadı.');

    const existing = await this.prisma.agency.findUnique({
      where: { name_companyId: { name: dto.name, companyId: dto.companyId } },
    });
    if (existing)
      throw new ConflictException(
        'Bu şirkete ait aynı isimde bir acente zaten mevcut.',
      );

    return this.prisma.agency.create({
      data: dto,
      include: { company: { select: { id: true, name: true } } },
    });
  }

  async findAll(query: QueryAgencyDto, user: AuthenticatedUser) {
    const { skip, take, search, isActive } = query;
    const where: Prisma.AgencyWhereInput = {};

    if (user.role === UserRole.COMPANY_USER) where.companyId = user.companyId;
    else if (user.role === UserRole.AGENCY_MANAGER) where.id = user.agencyId;
    else if (query.companyId) where.companyId = query.companyId;

    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.agency.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true } },
          _count: { select: { branches: true, users: true } },
        },
      }),
      this.prisma.agency.count({ where }),
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
    const agency = await this.prisma.agency.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true } },
        branches: {
          select: { id: true, name: true, isActive: true, createdAt: true },
        },
        _count: { select: { branches: true, users: true } },
      },
    });

    if (!agency) throw new NotFoundException('Acente bulunamadı.');

    if (
      user.role === UserRole.COMPANY_USER &&
      agency.companyId !== user.companyId
    ) {
      throw new ForbiddenException('Bu acenteye erişim yetkiniz yok.');
    }
    if (user.role === UserRole.AGENCY_MANAGER && agency.id !== user.agencyId) {
      throw new ForbiddenException(
        'Yalnızca kendi acentenize erişebilirsiniz.',
      );
    }

    return agency;
  }

  async update(id: string, dto: UpdateAgencyDto, user: AuthenticatedUser) {
    const agency = await this.findOne(id, user);

    if (dto.name && dto.name !== agency.name) {
      const targetCompanyId = dto.companyId || agency.companyId;
      const duplicate = await this.prisma.agency.findFirst({
        where: { name: dto.name, companyId: targetCompanyId, NOT: { id } },
      });
      if (duplicate)
        throw new ConflictException(
          'Bu şirkete ait aynı isimde başka bir acente zaten mevcut.',
        );
    }

    return this.prisma.agency.update({
      where: { id },
      data: dto,
      include: { company: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    await this.findOne(id, user);
    return this.prisma.agency.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
