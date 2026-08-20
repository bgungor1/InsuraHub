import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { PolicyState } from '@prisma/client';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';

export class CreatePolicyDto {
  @IsString({ message: 'Poliçe ürün türü geçerli bir metin olmalıdır.' })
  @IsNotEmpty({
    message: 'Poliçe ürün türü (örn: KASKO, TRAFIK, DASK) zorunludur.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  product: string;

  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir müşteri ID (MongoId) giriniz.' })
  customerId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  newCustomer?: CreateCustomerDto;

  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir şube ID (MongoId) giriniz.' })
  branchId?: string;

  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir broker ID (MongoId) giriniz.' })
  brokerId?: string;

  @IsOptional()
  @IsEnum(PolicyState, { message: 'Geçerli bir poliçe durumu seçiniz.' })
  state?: PolicyState;

  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir önceki poliçe ID giriniz.' })
  previousPolicyId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Prim tutarı sayı olmalıdır.' })
  @Min(0, { message: 'Prim tutarı 0 veya daha büyük olmalıdır.' })
  totalAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Teminat tutarı sayı olmalıdır.' })
  @Min(0, { message: 'Teminat tutarı 0 veya daha büyük olmalıdır.' })
  coverageAmount?: number;

  @IsOptional()
  @IsString({ message: 'Plaka geçerli bir metin olmalıdır.' })
  plateNumber?: string;

  @IsOptional()
  @IsString({ message: 'UAVT kodu geçerli bir metin olmalıdır.' })
  uavtCode?: string;

  @IsOptional()
  @IsString({ message: 'Ödeme planı geçerli bir metin olmalıdır.' })
  paymentTerm?: string;
}
