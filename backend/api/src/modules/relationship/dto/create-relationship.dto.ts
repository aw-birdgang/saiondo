import { ApiProperty } from '@nestjs/swagger';
import { RelationshipStatus } from '@prisma/client';

export class CreateRelationshipDto {
  @ApiProperty({ example: 'user1-uuid' })
  user1Id: string;

  @ApiProperty({ example: 'user2-uuid' })
  user2Id: string;

  @ApiProperty({ enum: RelationshipStatus })
  status: RelationshipStatus;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty({ required: false })
  endedAt?: Date;
}
