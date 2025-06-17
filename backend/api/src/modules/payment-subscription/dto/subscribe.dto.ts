import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty({ example: 'MONTHLY', description: '구독 플랜명' })
  plan: string;
}
