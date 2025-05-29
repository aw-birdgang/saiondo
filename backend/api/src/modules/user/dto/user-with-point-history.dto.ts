import { ApiProperty } from '@nestjs/swagger';

export class PointHistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  type: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: Date;
}

export class UserWithPointHistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  point: number;

  @ApiProperty({ type: [PointHistoryDto] })
  pointHistories: PointHistoryDto[];
}
