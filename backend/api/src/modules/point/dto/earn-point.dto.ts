import { ApiProperty } from '@nestjs/swagger';
import { PointType } from '@prisma/client';

export class EarnPointDto {
  @ApiProperty({ example: 10, description: '획득 포인트(양수)' })
  amount: number;

  @ApiProperty({ enum: PointType, example: 'MISSION_REWARD', description: '포인트 획득 타입' })
  type: PointType;

  @ApiProperty({ example: '미션 완료 보상', required: false })
  description?: string;
}
