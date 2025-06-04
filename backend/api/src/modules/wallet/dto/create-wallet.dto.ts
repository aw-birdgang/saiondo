import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ example: '0x1234...', description: '이더리움 지갑 주소' })
  @IsString()
  address: string;

  @ApiProperty({ example: true, description: '대표 지갑 여부', required: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
