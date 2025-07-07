import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: '알림 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '알림 내용' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ description: '알림 타입', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({ description: '추가 데이터 (JSON string)' })
  @IsOptional()
  @IsString()
  data?: string;

  @ApiPropertyOptional({ description: '읽음 여부', default: false })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
