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
import { BranchesService } from './branches.service';
import { CreateBranchDto, QueryBranchDto, UpdateBranchDto } from './dto';

@Controller('branches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER, UserRole.AGENCY_MANAGER)
  create(
    @Body() createBranchDto: CreateBranchDto,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.branchesService.create(createBranchDto, currentUser);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER, UserRole.AGENCY_MANAGER, UserRole.BRANCH_MANAGER)
  findAll(
    @Query() query: QueryBranchDto,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.branchesService.findAll(query, currentUser);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER, UserRole.AGENCY_MANAGER, UserRole.BRANCH_MANAGER)
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.branchesService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER, UserRole.AGENCY_MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.branchesService.update(id, updateBranchDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER, UserRole.AGENCY_MANAGER)
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.branchesService.remove(id, currentUser);
  }
}