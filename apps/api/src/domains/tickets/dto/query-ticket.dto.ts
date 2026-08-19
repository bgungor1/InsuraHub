import { TicketCategory, TicketStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class QueryTicketDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Başlangıç tarihi ISO formatında olmalıdır.' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Bitiş tarihi ISO formatında olmalıdır.' })
  endDate?: string;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 20);
  }

  get take(): number {
    return this.limit ?? 20;
  }
}
