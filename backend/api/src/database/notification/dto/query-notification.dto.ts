import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

export class FilterNotificationDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isRead?: boolean;
}

export class SortNotificationDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}

export class QueryNotificationDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterNotificationDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterNotificationDto)
  filters?: FilterNotificationDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortNotificationDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortNotificationDto)
  sort?: SortNotificationDto[] | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isRead?: boolean;
}
