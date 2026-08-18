import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles, CurrentUser } from '../../auth/decorators';
import type { AuthenticatedUser } from '../../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
  )
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.usersService.create(dto, user);
    return { message: 'Kullanıcı başarıyla oluşturuldu.', data };
  }

  @Get()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
  )
  async findAll(
    @Query() query: QueryUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.findAll(query, user);
  }

  @Get(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
  )
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.usersService.findOne(id, user);
    return { data };
  }

  @Patch(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.usersService.update(id, dto, user);
    return { message: 'Kullanıcı başarıyla güncellendi.', data };
  }

  @Delete(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
  )
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.usersService.remove(id, user);
    return { message: 'Kullanıcı başarıyla silindi.' };
  }
}