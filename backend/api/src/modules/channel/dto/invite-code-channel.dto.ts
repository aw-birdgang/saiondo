import {ApiProperty} from '@nestjs/swagger';

export class InviteCodeChannelDto {
  @ApiProperty({ example: 'channel-uuid' })
  channelId: string;
}
