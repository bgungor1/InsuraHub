import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString({ message: 'Müşteri adı geçerli bir metin olmalıdır.' })
  @IsNotEmpty({ message: 'Müşteri adı zorunludur.' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  firstName: string;

  @IsString({ message: 'Müşteri soyadı geçerli bir metin olmalıdır.' })
  @IsNotEmpty({ message: 'Müşteri soyadı zorunludur.' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  lastName: string;

  @IsString({ message: 'Kimlik/Vergi numarası geçerli bir metin olmalıdır.' })
  @IsNotEmpty({ message: 'Kimlik numarası (TCKN veya VKN) zorunludur.' })
  @Length(10, 11, {
    message: 'Kimlik/Vergi numarası 10 veya 11 haneli olmalıdır.',
  })
  @Matches(/^[0-9]+$/, {
    message: 'Kimlik numarası sadece rakamlardan oluşmalıdır.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  identityNo: string;

  @IsOptional()
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email?: string;

  @IsOptional()
  @IsString({ message: 'Telefon numarası geçerli bir metin olmalıdır.' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/[\s()\-+]/g, '').trim() : value,
  )
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Adres geçerli bir metin olmalıdır.' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  address?: string;

  @IsOptional()
  @IsString({ message: 'İl bilgisi geçerli bir metin olmalıdır.' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  city?: string;

  @IsOptional()
  @IsString({ message: 'İlçe bilgisi geçerli bir metin olmalıdır.' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  district?: string;
}
