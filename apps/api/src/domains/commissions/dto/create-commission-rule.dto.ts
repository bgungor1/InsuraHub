import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCommissionRuleDto {
  @IsString()
  @IsNotEmpty({ message: 'Komisyon kural adı zorunludur.' })
  name: string;

  @IsNumber({}, { message: 'Şirket payı sayısal bir değer olmalıdır.' })
  @Min(0, { message: 'Şirket payı 0 ile 100 arasında olmalıdır.' })
  @Max(100, { message: 'Şirket payı 0 ile 100 arasında olmalıdır.' })
  companyShare: number;

  @IsNumber({}, { message: 'Acente payı sayısal bir değer olmalıdır.' })
  @Min(0, { message: 'Acente payı 0 ile 100 arasında olmalıdır.' })
  @Max(100, { message: 'Acente payı 0 ile 100 arasında olmalıdır.' })
  agencyShare: number;

  @IsNumber({}, { message: 'Şube payı sayısal bir değer olmalıdır.' })
  @Min(0, { message: 'Şube payı 0 ile 100 arasında olmalıdır.' })
  @Max(100, { message: 'Şube payı 0 ile 100 arasında olmalıdır.' })
  branchShare: number;

  @IsNumber({}, { message: 'Broker payı sayısal bir değer olmalıdır.' })
  @Min(0, { message: 'Broker payı 0 ile 100 arasında olmalıdır.' })
  @Max(100, { message: 'Broker payı 0 ile 100 arasında olmalıdır.' })
  brokerShare: number;

  @IsDateString(
    {},
    { message: 'Geçerlilik başlangıç tarihi ISO formatında olmalıdır.' },
  )
  @IsOptional()
  validFrom?: string;
}
