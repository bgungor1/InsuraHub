import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryUserDto extends PaginationDto {
  @IsOptional()
  @IsEnum(UserRole, { message: 'Geçerli bir kullanıcı rolü seçiniz.' })
  role?: UserRole;

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
