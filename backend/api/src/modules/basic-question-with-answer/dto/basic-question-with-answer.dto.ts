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

  @ApiProperty({ type: [String] })
  options: string[];

  @ApiProperty({ example: '2024-06-10T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-06-10T12:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ type: () => BasicAnswerResponseDto, nullable: true })
  answer?: BasicAnswerResponseDto | null;

  static fromEntity(question: any, answer: any): BasicQuestionWithAnswerDto {
    return {
      id: question.id,
      categoryId: question.categoryId,
      question: question.question,
      description: question.description ?? undefined,
      options: question.options ?? [],
      createdAt: question.createdAt instanceof Date ? question.createdAt.toISOString() : question.createdAt,
      updatedAt: question.updatedAt instanceof Date ? question.updatedAt.toISOString() : question.updatedAt,
      answer: answer ? BasicAnswerResponseDto.fromEntity(answer) : null,
    };
  }
}
