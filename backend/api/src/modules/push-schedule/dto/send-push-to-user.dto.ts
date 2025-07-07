import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class SendPushToUserDto {
  @ApiProperty({ example: '테스트 알림', description: '푸시 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '이것은 테스트 푸시 메시지입니다.',
    description: '푸시 내용',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({
    example: { channelId: 'value1', assistantId: 'value2' },
    description: '추가 데이터 (선택)',
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
