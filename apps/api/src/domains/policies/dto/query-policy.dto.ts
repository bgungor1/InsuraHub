import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PolicyState } from '@prisma/client';
import { PaginationDto } from '../../../common/dto';

export class QueryPolicyDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PolicyState)
  state?: PolicyState;

  @IsOptional()
  @IsMongoId()
  customerId?: string;

  @IsOptional()
  @IsMongoId()
  branchId?: string;

  @IsOptional()
  @IsMongoId()
  brokerId?: string;

  @IsOptional()
  @IsString()
  product?: string;
}
