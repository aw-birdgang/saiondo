import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProfileSource } from '@prisma/client';

export class UpdatePersonaProfileDto {
  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional()
  isStatic?: boolean;

  @ApiPropertyOptional({ enum: ProfileSource })
  source?: ProfileSource;

  @ApiPropertyOptional()
  confidenceScore?: number;
}
