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
import { CurrentUser, Roles } from '../../auth/decorators';
import type { AuthenticatedUser } from '../../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, QueryCustomerDto, UpdateCustomerDto } from './dto';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const data = await this.customersService.create(createCustomerDto);
    return { message: 'Müşteri başarıyla oluşturuldu.', data };
  }

  @Get()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async findAll(
    @Query() query: QueryCustomerDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.customersService.findAll(query, currentUser);
  }

  @Get('lookup/:identityNo')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async findByIdentityNo(@Param('identityNo') identityNo: string) {
    const data = await this.customersService.findByIdentityNo(identityNo);
    return { data };
  }

  @Get(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async findOne(@Param('id') id: string) {
    const data = await this.customersService.findOne(id);
    return { data };
  }

  @Patch(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const data = await this.customersService.update(id, updateCustomerDto);
    return { message: 'Müşteri bilgileri güncellendi.', data };
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER, UserRole.AGENCY_MANAGER)
  async remove(@Param('id') id: string) {
    await this.customersService.remove(id);
    return { message: 'Müşteri kaydı başarıyla silindi.' };
  }
}
