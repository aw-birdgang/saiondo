import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WalletDto {
  @ApiProperty({ description: '지갑 고유 ID' })
  id: string;

  @ApiProperty({ description: '이더리움 주소' })
  address: string;

  @ApiProperty({ description: '토큰 잔액(문자열)' })
  tokenBalance: string;

  @ApiPropertyOptional({ description: '복호화된 mnemonic (보안상 필요할 때만 반환)' })
  mnemonic?: string;

  @ApiPropertyOptional({ description: '복호화된 privateKey (보안상 필요할 때만 반환)' })
  privateKey?: string;

  @ApiProperty({ description: 'HD 파생 인덱스', example: 0 })
  derivationIndex: number;

  @ApiPropertyOptional({ description: '생성일시', type: String, format: 'date-time' })
  createdAt?: string;

  @ApiPropertyOptional({ description: '수정일시', type: String, format: 'date-time' })
  updatedAt?: string;

  @ApiPropertyOptional({ description: '연결된 유저 ID', type: String })
  userId?: string;
}