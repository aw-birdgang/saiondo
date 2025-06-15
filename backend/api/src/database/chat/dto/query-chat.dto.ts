import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { Chat } from '../domain/chat';

export class FilterChatDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested({ each: true })
  id: number | string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @ValidateNested({ each: true })
  memberId: number | string;
}

export class SortChatDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Chat;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryChatDto {
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
    value ? plainToInstance(FilterChatDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterChatDto)
  filters?: FilterChatDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortChatDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortChatDto)
  sort?: SortChatDto[] | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  senderId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  channelId?: string;
}
