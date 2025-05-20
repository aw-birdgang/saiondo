import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { ChatHistory } from '../domain/chat-history';

export class FilterChatHistoryDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested({ each: true })
  id: number | string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested({ each: true })
  memberId: number | string;
}

export class SortChatHistoryDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof ChatHistory;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryChatHistoryDto {
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
    value
      ? plainToInstance(FilterChatHistoryDto, JSON.parse(value))
      : undefined,
  )
  @ValidateNested()
  @Type(() => FilterChatHistoryDto)
  filters?: FilterChatHistoryDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortChatHistoryDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortChatHistoryDto)
  sort?: SortChatHistoryDto[] | null;
}
