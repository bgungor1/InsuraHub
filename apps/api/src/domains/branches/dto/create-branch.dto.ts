import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty({ message: 'Şube adı zorunludur.' })
  @Length(2, 100, { message: 'Şube adı 2 ile 100 karakter arasında olmalıdır.' })
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @IsMongoId({ message: 'Geçerli bir Acente ID (MongoDB ObjectId) girilmelidir.' })
  @IsNotEmpty({ message: 'Şubenin bağlı olduğu acente seçilmelidir.' })
  agencyId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
