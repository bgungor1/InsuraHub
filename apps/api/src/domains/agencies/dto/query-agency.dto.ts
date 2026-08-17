import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto';

export class QueryAgencyDto extends PaginationDto {
  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir Şirket ID (MongoDB ObjectId) girilmelidir.' })
  companyId?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isActive?: boolean;
}
