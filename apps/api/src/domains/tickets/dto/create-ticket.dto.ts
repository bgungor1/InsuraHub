import { TicketCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'Destek talebi başlığı zorunludur.' })
  subject: string;

  @IsEnum(TicketCategory, { message: 'Geçersiz destek kategorisi.' })
  category: TicketCategory;

  @IsString()
  @IsNotEmpty({ message: 'İlk mesaj içeriği zorunludur.' })
  message: string;
}
