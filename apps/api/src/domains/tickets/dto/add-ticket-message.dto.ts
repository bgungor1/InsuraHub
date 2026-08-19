import { IsNotEmpty, IsString } from 'class-validator';

export class AddTicketMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Mesaj içeriği zorunludur.' })
  body: string;
}
