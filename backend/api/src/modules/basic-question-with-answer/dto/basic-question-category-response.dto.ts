import { ApiProperty } from '@nestjs/swagger';

export class BasicQuestionCategoryResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'PERSONALITY' })
  code: string;

  @ApiProperty({ example: '성격/성향' })
  name: string;

  @ApiProperty({ example: '기본 성향과 사고방식 파악', required: false })
  description?: string;

  static fromEntity(entity: any): BasicQuestionCategoryResponseDto {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description ?? undefined,
    };
  }
}
