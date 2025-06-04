import { ApiProperty } from '@nestjs/swagger';

export class WalletDto {
  @ApiProperty()
  address: string;
}

export class UserWithWalletDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  point: number;
  @ApiProperty({ type: WalletDto, required: false })
  wallet?: WalletDto;
}
