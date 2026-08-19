import { TicketStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus, { message: 'Geçersiz destek durumu.' })
  status: TicketStatus;
}
