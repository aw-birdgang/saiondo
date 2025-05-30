import { ApiProperty } from '@nestjs/swagger';

export class BasicQuestionResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: '나는 외향적인 편이다.' })
  question: string;

  @ApiProperty({ example: '성격' })
  description?: string;

  @ApiProperty({ example: '2024-06-10T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-06-10T12:00:00.000Z' })
  updatedAt: string;

  static fromEntity(entity: any): BasicQuestionResponseDto {
    return {
      id: entity.id,
      question: entity.question,
      description: entity.description ?? undefined,
      createdAt: entity.createdAt instanceof Date ? entity.createdAt.toISOString() : entity.createdAt,
      updatedAt: entity.updatedAt instanceof Date ? entity.updatedAt.toISOString() : entity.updatedAt,
    };
  }
}