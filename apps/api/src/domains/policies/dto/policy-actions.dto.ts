import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ReleasePolicyDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CompletePolicyDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Toplam prim tutarı sayı olmalıdır.' })
  @Min(0.01, { message: 'Toplam prim tutarı 0’dan büyük olmalıdır.' })
  totalAmount: number;
}
