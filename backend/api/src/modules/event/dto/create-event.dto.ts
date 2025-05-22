import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: '데이트', description: '이벤트 제목' })
  @IsString()
  title: string;

  @ApiProperty({ example: '카페에서 만남', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-06-01T10:00:00.000Z', description: '시작 시간' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2024-06-01T12:00:00.000Z', description: '종료 시간' })
  @IsDateString()
  endTime: string;
}
