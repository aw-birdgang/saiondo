import { ApiProperty } from '@nestjs/swagger';

export class MnemonicResponseDto {
  @ApiProperty({ description: '랜덤 mnemonic' })
  mnemonic: string;
}
