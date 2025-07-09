// backend/api/src/modules/personality/dto/common/message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class MessageDto {
  @ApiProperty({ description: '메시지 발신자', example: 'user' })
  @IsString()
  sender: string;

  @ApiProperty({ description: '메시지 내용', example: '안녕?' })
  @IsString()
  text: string;

  @ApiProperty({ 
    description: '메시지 타임스탬프', 
    example: '2024-01-15T14:30:00Z',
    required: false 
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}