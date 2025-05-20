import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendPushDto {
  @ApiProperty({
    example: 'fcm_token_string',
    description: '푸시를 받을 FCM 토큰',
  })
  token: string;

  @ApiProperty({
    example: '테스트 알림',
    description: '푸시 제목',
  })
  title: string;

  @ApiProperty({
    example: '이것은 테스트 푸시 메시지입니다.',
    description: '푸시 내용',
  })
  body: string;

  @ApiPropertyOptional({
    example: { customKey1: 'value1', customKey2: 'value2' },
    description: '추가 데이터 (선택)',
    type: 'object',
  })
  data?: Record<string, string>;
}
