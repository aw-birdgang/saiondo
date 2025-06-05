import { ApiProperty } from '@nestjs/swagger';

export class TokenTransferResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() toAddress: string;
  @ApiProperty() amount: string;
  @ApiProperty() txHash: string;
  @ApiProperty() status: string;
  @ApiProperty() createdAt: Date;
}
