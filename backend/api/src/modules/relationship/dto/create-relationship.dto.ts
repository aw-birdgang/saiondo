import { ApiProperty } from '@nestjs/swagger';
import { RelationshipStatus } from '@prisma/client';

export class CreateRelationshipDto {
  @ApiProperty()
  user1Id: string;

  @ApiProperty()
  user2Id: string;

  @ApiProperty({ enum: RelationshipStatus })
  status: RelationshipStatus;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty({ required: false })
  endedAt?: Date;
}
