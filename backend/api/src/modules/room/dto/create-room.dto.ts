import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ description: 'Relationship ID', example: 'uuid-string' })
  relationshipId: string;
}