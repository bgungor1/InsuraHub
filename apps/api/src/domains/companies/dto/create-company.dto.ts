import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: 'Şirket adı zorunludur.' })
  @Length(2, 100, { message: 'Şirket adı 2 ile 100 karakter arasında olmalıdır.' })
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Vergi numarası 10 haneli rakamlardan oluşmalıdır.' })
  taxNumber?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}