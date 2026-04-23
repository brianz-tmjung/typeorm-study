import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  where__id__more_than?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  where__id__less_than?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt?: 'ASC' | 'DESC' = 'ASC';

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  take: number = 20;
}
