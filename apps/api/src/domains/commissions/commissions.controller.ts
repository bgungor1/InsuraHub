import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser, Roles } from '../../auth/decorators';
import type { AuthenticatedUser } from '../../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { CommissionsService } from './commissions.service';
import { CreateCommissionRuleDto, QueryCommissionDto } from './dto';

@Controller('commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Post('rules')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER)
  async createRule(@Body() dto: CreateCommissionRuleDto) {
    const data = await this.commissionsService.createRule(dto);
    return { message: 'Komisyon kuralı başarıyla oluşturuldu.', data };
  }

  @Get('rules/active')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async getActiveRules() {
    const data = await this.commissionsService.getActiveRules();
    return { data };
  }

  @Get('rules')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER)
  async getAllRules() {
    const data = await this.commissionsService.getAllRules();
    return { data };
  }

  @Get('snapshots')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async getSnapshots(
    @Query() query: QueryCommissionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commissionsService.findAllSnapshots(query, user);
  }

  @Get('snapshots/:policyId')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.COMPANY_USER,
    UserRole.AGENCY_MANAGER,
    UserRole.BRANCH_MANAGER,
    UserRole.BROKER,
  )
  async getSnapshotByPolicyId(
    @Param('policyId') policyId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.commissionsService.findSnapshotByPolicyId(
      policyId,
      user,
    );
    return { data };
  }

  @Post('calculate/:policyId')
  @Roles(UserRole.SUPERADMIN, UserRole.COMPANY_USER)
  async calculateForPolicy(
    @Param('policyId') policyId: string,
    @Body('totalAmount') totalAmount?: number,
  ) {
    const data = await this.commissionsService.calculateAndSnapshot(
      policyId,
      totalAmount,
    );
    return {
      message: 'Komisyon başarıyla hesaplandı ve dekont oluşturuldu.',
      data,
    };
  }
}
