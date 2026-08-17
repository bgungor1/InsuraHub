import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, QueryCompanyDto, UpdateCompanyDto } from './dto';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN)
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER)
  findAll(@Query() query: QueryCompanyDto) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER)
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
