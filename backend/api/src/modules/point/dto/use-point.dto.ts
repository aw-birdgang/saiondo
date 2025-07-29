import { ApiProperty } from '@nestjs/swagger';
import { PointType } from '@prisma/client';

export class UsePointDto {
  @ApiProperty({ example: 5, description: '사용 포인트(양수)' })
  amount: number;

  @ApiProperty({ enum: PointType, example: 'CHAT_USE', description: '포인트 사용 타입' })
  type: PointType;

  @ApiProperty({ example: 'AI 대화 시도', required: false })
  description?: string;
}
