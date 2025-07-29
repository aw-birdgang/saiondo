import { ApiProperty } from '@nestjs/swagger';

export class JoinByInviteDto {
  @ApiProperty({ example: '초대코드' })
  inviteCode: string;

  @ApiProperty({ example: '여자친구 userId' })
  userId: string;
}
