import { ApiProperty } from '@nestjs/swagger';
import { BasicAnswerResponseDto } from './basic-answer-response.dto';

export class BasicQuestionWithAnswerDto {
  @ApiProperty({ example: 'question-uuid' })
  id: string;

  @ApiProperty({ example: 'category-uuid' })
  categoryId: string;

  @ApiProperty({ example: '나는 외향적인 편이다.' })
  question: string;

  @ApiProperty({ example: '성격' })
  description?: string;

  @ApiProperty({ example: '2024-06-10T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-06-10T12:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ type: () => BasicAnswerResponseDto, nullable: true })
  answer?: BasicAnswerResponseDto | null;

  static fromEntity(entity: any, answer: any): BasicQuestionWithAnswerDto {
    return {
      id: entity.id,
      categoryId: entity.categoryId,
      question: entity.question,
      description: entity.description ?? undefined,
      createdAt: entity.createdAt instanceof Date ? entity.createdAt.toISOString() : entity.createdAt,
      updatedAt: entity.updatedAt instanceof Date ? entity.updatedAt.toISOString() : entity.updatedAt,
      answer: answer ? BasicAnswerResponseDto.fromEntity(answer) : null,
    };
  }
}
