import { ApiProperty } from '@nestjs/swagger';
import { ProfileSource } from '@prisma/client';

export class CreatePersonaProfileDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  categoryCode: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false })
  isStatic?: boolean;

  @ApiProperty({ enum: ProfileSource })
  source: ProfileSource;

  @ApiProperty()
  confidenceScore: number;
}
