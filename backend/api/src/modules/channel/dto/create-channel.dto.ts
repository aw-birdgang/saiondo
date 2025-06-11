import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ description: '유저 ID' })
  userId: string;

  @ApiProperty({ description: '초대 코드', required: false })
  inviteCode?: string;

  @ApiProperty({ description: '상태', required: false })
  status?: string;
}
