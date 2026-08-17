import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto, QueryCompanyDto, UpdateCompanyDto } from './dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCompanyDto: CreateCompanyDto) {
    const existingName = await this.prisma.company.findUnique({
      where: { name: createCompanyDto.name },
    });
    if (existingName) {
      throw new ConflictException('Bu isimde bir şirket zaten mevcut.');
    }

    if (createCompanyDto.taxNumber) {
      const existingTax = await this.prisma.company.findUnique({
        where: { taxNumber: createCompanyDto.taxNumber },
      });
      if (existingTax) {
        throw new ConflictException('Bu vergi numarasına sahip bir şirket zaten mevcut.');
      }
    }

    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async findAll(query: QueryCompanyDto) {
    const { skip, take, search, isActive } = query;

    const where: Prisma.CompanyWhereInput = {};

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { taxNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { agencies: true, users: true },
          },
        },
      }),
      this.prisma.company.count({ where }),
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

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        agencies: {
          select: {
            id: true,
            name: true,
            isActive: true,
            createdAt: true,
          },
        },
        _count: {
          select: { agencies: true, users: true },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Şirket bulunamadı.');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);

    if (updateCompanyDto.name) {
      const existingName = await this.prisma.company.findFirst({
        where: { name: updateCompanyDto.name, NOT: { id } },
      });
      if (existingName) {
        throw new ConflictException('Bu isimde başka bir şirket zaten mevcut.');
      }
    }

    if (updateCompanyDto.taxNumber) {
      const existingTax = await this.prisma.company.findFirst({
        where: { taxNumber: updateCompanyDto.taxNumber, NOT: { id } },
      });
      if (existingTax) {
        throw new ConflictException('Bu vergi numarasına sahip başka bir şirket zaten mevcut.');
      }
    }

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.company.update({
      where: { id },
      data: { isActive: false },
    });
  }
}