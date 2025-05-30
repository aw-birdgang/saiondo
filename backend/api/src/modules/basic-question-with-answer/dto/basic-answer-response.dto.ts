import {ApiProperty} from '@nestjs/swagger';
import {BasicQuestionResponseDto} from "@modules/basic-question-with-answer/dto/basic-question-response.dto";

export class BasicAnswerResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user-uuid' })
  userId: string;

  @ApiProperty({ example: 'question-uuid' })
  questionId: string;

  @ApiProperty({ example: '저는 외향적인 편입니다.' })
  answer: string;

  @ApiProperty({ example: '2024-06-10T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-06-10T12:00:00.000Z' })
  updatedAt: string;

  static fromEntity(entity: any): BasicAnswerResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      questionId: entity.questionId,
      answer: entity.answer,
      createdAt: entity.createdAt instanceof Date ? entity.createdAt.toISOString() : entity.createdAt,
      updatedAt: entity.updatedAt instanceof Date ? entity.updatedAt.toISOString() : entity.updatedAt,
    };
  }
}

export class BasicAnswerWithQuestionResponseDto extends BasicAnswerResponseDto {
    @ApiProperty({ type: BasicQuestionResponseDto })
    question: BasicQuestionResponseDto;

    static fromEntity(entity: any): BasicAnswerWithQuestionResponseDto {
        return {
            ...BasicAnswerResponseDto.fromEntity(entity),
            question: BasicQuestionResponseDto.fromEntity(entity.question),
        };
    }
}
