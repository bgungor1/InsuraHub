import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/decorators';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';

const userSelectFields = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  companyId: true,
  agencyId: true,
  branchId: true,
  createdAt: true,
  updatedAt: true,
  company: { select: { id: true, name: true } },
  agency: { select: { id: true, name: true } },
  branch: { select: { id: true, name: true } },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto, currentUser: AuthenticatedUser) {
    this.enforceCreationScope(dto, currentUser);
    await this.resolveHierarchyIds(dto);

    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists)
      throw new ConflictException('Bu e-posta adresi zaten kullanımda.');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
      select: userSelectFields,
    });
  }

  async findAll(query: QueryUserDto, currentUser: AuthenticatedUser) {
    const andConditions: Prisma.UserWhereInput[] = [];

    if (currentUser.role === UserRole.COMPANY_USER && currentUser.companyId) {
      andConditions.push({
        OR: [
          { companyId: currentUser.companyId },
          { agency: { companyId: currentUser.companyId } },
          { branch: { agency: { companyId: currentUser.companyId } } },
        ],
      });
    } else if (
      currentUser.role === UserRole.AGENCY_MANAGER &&
      currentUser.agencyId
    ) {
      andConditions.push({
        OR: [
          { agencyId: currentUser.agencyId },
          { branch: { agencyId: currentUser.agencyId } },
        ],
      });
    } else if (
      (currentUser.role === UserRole.BRANCH_MANAGER ||
        currentUser.role === UserRole.BROKER) &&
      currentUser.branchId
    ) {
      andConditions.push({ branchId: currentUser.branchId });
    }

    if (query.role) andConditions.push({ role: query.role });
    if (typeof query.isActive === 'boolean')
      andConditions.push({ isActive: query.isActive });
    if (query.companyId && currentUser.role === UserRole.SUPERADMIN)
      andConditions.push({ companyId: query.companyId });
    if (query.agencyId) andConditions.push({ agencyId: query.agencyId });
    if (query.branchId) andConditions.push({ branchId: query.branchId });

    if (query.search?.trim()) {
      const s = query.search.trim();
      andConditions.push({
        OR: [
          { firstName: { contains: s, mode: 'insensitive' } },
          { lastName: { contains: s, mode: 'insensitive' } },
          { email: { contains: s, mode: 'insensitive' } },
        ],
      });
    }

    const where: Prisma.UserWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: userSelectFields,
      }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, currentUser: AuthenticatedUser) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelectFields,
    });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı.');
    this.verifyUserScope(user, currentUser);
    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    const data: Prisma.UserUpdateInput = { ...dto };
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelectFields,
    });
  }

  async remove(id: string, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    return this.prisma.user.delete({ where: { id }, select: { id: true } });
  }

  private enforceCreationScope(dto: CreateUserDto, u: AuthenticatedUser) {
    if (u.role === UserRole.COMPANY_USER) {
      if (dto.role === UserRole.SUPERADMIN) throw new ForbiddenException();
      dto.companyId = u.companyId ?? undefined;
    } else if (u.role === UserRole.AGENCY_MANAGER) {
      if (
        dto.role === UserRole.SUPERADMIN ||
        dto.role === UserRole.COMPANY_USER
      )
        throw new ForbiddenException();
      dto.companyId = u.companyId ?? undefined;
      dto.agencyId = u.agencyId ?? undefined;
    } else if (u.role === UserRole.BRANCH_MANAGER) {
      if (dto.role !== UserRole.BROKER) throw new ForbiddenException();
      dto.companyId = u.companyId ?? undefined;
      dto.agencyId = u.agencyId ?? undefined;
      dto.branchId = u.branchId ?? undefined;
    }
  }

  private async resolveHierarchyIds(dto: CreateUserDto) {
    if (dto.branchId) {
      const branch = await this.prisma.branch.findUnique({
        where: { id: dto.branchId },
        include: { agency: true },
      });
      if (!branch) throw new BadRequestException('Geçersiz şube seçimi.');
      dto.agencyId = branch.agencyId;
      dto.companyId = branch.agency.companyId;
    } else if (dto.agencyId && !dto.companyId) {
      const agency = await this.prisma.agency.findUnique({
        where: { id: dto.agencyId },
      });
      if (agency) dto.companyId = agency.companyId;
    }
  }

  private verifyUserScope(
    t: {
      companyId?: string | null;
      agencyId?: string | null;
      branchId?: string | null;
      company?: { id?: string } | null;
      agency?: { id?: string } | null;
      branch?: { id?: string } | null;
    },
    u: AuthenticatedUser,
  ) {
    if (u.role === UserRole.SUPERADMIN) return;
    if (
      u.role === UserRole.COMPANY_USER &&
      t.companyId &&
      t.companyId !== u.companyId
    )
      throw new ForbiddenException();
    if (
      u.role === UserRole.AGENCY_MANAGER &&
      t.agencyId &&
      t.agencyId !== u.agencyId
    )
      throw new ForbiddenException();
    if (
      u.role === UserRole.BRANCH_MANAGER &&
      t.branchId &&
      t.branchId !== u.branchId
    )
      throw new ForbiddenException();
  }
}
