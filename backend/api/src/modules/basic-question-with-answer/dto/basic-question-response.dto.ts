import { ApiProperty } from '@nestjs/swagger';

export class BasicQuestionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  question: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty({ type: [String] })
  options: string[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  static fromEntity(entity: any): BasicQuestionResponseDto {
    return {
      id: entity.id,
      question: entity.question,
      description: entity.description ?? undefined,
      categoryId: entity.categoryId,
      options: entity.options ?? [],
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}