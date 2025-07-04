import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendPushToUserDto {
  @ApiProperty({ example: '테스트 알림', description: '푸시 제목' })
  title: string;

  @ApiProperty({
    example: '이것은 테스트 푸시 메시지입니다.',
    description: '푸시 내용',
  })
  body: string;

  @ApiPropertyOptional({
    example: { channelId: 'value1', assistantId: 'value2' },
    description: '추가 데이터 (선택)',
    type: 'object',
  })
  data?: Record<string, string>;
}
