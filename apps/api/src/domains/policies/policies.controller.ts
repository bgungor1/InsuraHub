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
import { PoliciesService } from './policies.service';
import {
  CompletePolicyDto,
  CreatePolicyDto,
  QueryPolicyDto,
  ReleasePolicyDto,
  UpdatePolicyDto,
} from './dto';

@Controller('policies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async create(
    @Body() dto: CreatePolicyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.policiesService.create(dto, user);
    return { message: 'Poliçe kaydı başarıyla oluşturuldu.', data };
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
    @Query() query: QueryPolicyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.policiesService.findAll(query, user);
  }

  @Get(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.policiesService.findOne(id, user);
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
    @Body() dto: UpdatePolicyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.policiesService.update(id, dto, user);
    return { message: 'Poliçe bilgileri güncellendi.', data };
  }

  @Post(':id/claim')
  @Patch(':id/claim')
  @Roles(UserRole.SUPERADMIN, UserRole.BRANCH_MANAGER, UserRole.BROKER)
  async claim(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.policiesService.claim(id, user);
    return { message: 'Poliçe başarıyla üzerinize alındı.', data };
  }

  @Post(':id/release')
  @Patch(':id/release')
  @Roles(UserRole.SUPERADMIN, UserRole.BRANCH_MANAGER, UserRole.BROKER)
  async release(
    @Param('id') id: string,
    @Body() dto: ReleasePolicyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.policiesService.release(id, dto, user);
    return { message: 'Poliçe havuza iade edildi.', data };
  }

  @Post(':id/complete')
  @Patch(':id/complete')
  @Roles(UserRole.SUPERADMIN, UserRole.BRANCH_MANAGER, UserRole.BROKER)
  async complete(
    @Param('id') id: string,
    @Body() dto: CompletePolicyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.policiesService.complete(id, dto, user);
    return { message: 'Poliçe tamamlandı ve komisyon payları hesaplandı.', data };
  }

  @Post(':id/cancel')
  @Patch(':id/cancel')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
  )
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.policiesService.cancel(id, user);
    return { message: 'Poliçe iptal edildi.', data };
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.policiesService.remove(id, user);
    return { message: 'Poliçe kaydı silindi.' };
  }
}
