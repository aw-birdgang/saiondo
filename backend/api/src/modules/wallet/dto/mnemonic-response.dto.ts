import { ApiProperty } from '@nestjs/swagger';

export class MnemonicResponseDto {
  @ApiProperty({ description: '복호화된 mnemonic' })
  mnemonic: string;
}
