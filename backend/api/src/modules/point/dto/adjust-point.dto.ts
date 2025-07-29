import { ApiProperty } from '@nestjs/swagger';

export class AdjustPointDto {
  @ApiProperty({ example: -10, description: '조정 포인트(양수/음수)' })
  amount: number;

  @ApiProperty({ example: '관리자 수동 조정', required: false })
  description?: string;
}
