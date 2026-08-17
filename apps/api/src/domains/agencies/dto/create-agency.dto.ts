import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  @IsNotEmpty({ message: 'Acente adı zorunludur.' })
  @Length(2, 100, { message: 'Acente adı 2 ile 100 karakter arasında olmalıdır.' })
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @IsMongoId({ message: 'Geçerli bir Şirket ID (MongoDB ObjectId) girilmelidir.' })
  @IsNotEmpty({ message: 'Acentenin bağlı olduğu şirket seçilmelidir.' })
  companyId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
