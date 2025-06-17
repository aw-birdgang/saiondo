import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionHistoryDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user-uuid' })
  userId: string;

  @ApiProperty({ example: 'MONTHLY' })
  plan: string;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z' })
  startedAt: Date;

  @ApiProperty({ example: '2024-07-01T00:00:00.000Z' })
  expiredAt: Date;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z' })
  createdAt: Date;
}
