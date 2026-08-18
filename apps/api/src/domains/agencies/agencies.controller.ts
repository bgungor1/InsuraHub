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
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import type { AuthenticatedUser } from '../../auth/strategies';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto, QueryAgencyDto, UpdateAgencyDto } from './dto';

@Controller('agencies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER)
  create(
    @Body() createAgencyDto: CreateAgencyDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.agenciesService.create(createAgencyDto, currentUser);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER, UserRole.AGENCY_MANAGER)
  findAll(
    @Query() query: QueryAgencyDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.agenciesService.findAll(query, currentUser);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER, UserRole.AGENCY_MANAGER)
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.agenciesService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER)
  update(
    @Param('id') id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.agenciesService.update(id, updateAgencyDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER)
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.agenciesService.remove(id, currentUser);
  }
}
