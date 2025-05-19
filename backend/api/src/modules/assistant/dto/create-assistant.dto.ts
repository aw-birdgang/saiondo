import { ApiProperty } from '@nestjs/swagger';

export class CreateAssistantDto {
  @ApiProperty({ description: 'Channel ID', example: 'uuid-string' })
  channelId: string;

  @ApiProperty({ description: 'User ID', example: 'uuid-string' })
  userId: string;
}
