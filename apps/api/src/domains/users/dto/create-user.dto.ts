import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Ad zorunludur.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Soyad zorunludur.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastName: string;

  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' })
  password: string;

  @IsEnum(UserRole, { message: 'Geçerli bir kullanıcı rolü seçiniz.' })
  role: UserRole;

  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir şirket kimliği (ObjectId) giriniz.' })
  companyId?: string;

  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir acente kimliği (ObjectId) giriniz.' })
  agencyId?: string;

  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir şube kimliği (ObjectId) giriniz.' })
  branchId?: string;
}
