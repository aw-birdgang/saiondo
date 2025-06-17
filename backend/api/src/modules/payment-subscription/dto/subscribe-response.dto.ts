import { ApiProperty } from '@nestjs/swagger';

export class SubscribeResponseDto {
  @ApiProperty({ example: true, description: '구독 성공 여부' })
  success: boolean;

  @ApiProperty({
    example: '2024-07-01T00:00:00.000Z',
    description: '구독 만료일 (ISO 8601 형식)',
    type: String,
    format: 'date-time',
  })
  expiredAt: Date;
}