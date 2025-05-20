// src/modules/question-template/dto/create-question-template.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionTemplateDto {
  @ApiProperty()
  categoryCodeId: string;

  @ApiProperty()
  questionText: string;

  @ApiProperty()
  tier: number;

  @ApiProperty({ enum: ['PERSONALITY', 'RELATIONSHIP', 'DAILY', 'MBTI'] })
  type: string;
}
