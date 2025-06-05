import { ApiProperty } from '@nestjs/swagger';

export class ConvertPointDto {
  @ApiProperty({ description: '전환할 포인트', example: 100 })
  pointAmount: number;
}
