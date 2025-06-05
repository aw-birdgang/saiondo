import { ApiProperty } from '@nestjs/swagger';

export class ConvertTokenDto {
  @ApiProperty({ description: '변환할 토큰 수량', example: 10 })
  tokenAmount: number;
}