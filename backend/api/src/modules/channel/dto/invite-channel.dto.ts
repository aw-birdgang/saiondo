import { ApiProperty } from '@nestjs/swagger';

export class InviteChannelDto {
  @ApiProperty({ example: 'user1-uuid' })
  user1Id: string;

  @ApiProperty({ example: 'user2-uuid' })
  user2Id: string;
}
