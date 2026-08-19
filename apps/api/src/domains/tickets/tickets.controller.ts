import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TicketStatus } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators';
import type { AuthenticatedUser } from '../../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { TicketsService } from './tickets.service';
import {
  AddTicketMessageDto,
  CreateTicketDto,
  QueryTicketDto,
  UpdateTicketStatusDto,
} from './dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(
    @Body() dto: CreateTicketDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.ticketsService.create(dto, user);
    return { message: 'Destek talebi başarıyla oluşturuldu.', data };
  }

  @Get()
  async findAll(
    @Query() query: QueryTicketDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ticketsService.findAll(query, user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.ticketsService.findOne(id, user);
    return { data };
  }

  @Post(':id/messages')
  async addMessage(
    @Param('id') id: string,
    @Body() dto: AddTicketMessageDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.ticketsService.addMessage(id, dto, user);
    return { message: 'Yanıtınız iletildi.', data };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTicketStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.ticketsService.updateStatus(id, dto.status, user);
    return { message: 'Destek talebi durumu güncellendi.', data };
  }

  @Patch(':id/close')
  async closeTicket(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.ticketsService.updateStatus(
      id,
      TicketStatus.CLOSED,
      user,
    );
    return { message: 'Destek talebi kapatıldı.', data };
  }
}
