import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnniversaryDto {
  @ApiProperty({ example: '2022-01-01' })
  anniversary: string; // ISO date string
}
