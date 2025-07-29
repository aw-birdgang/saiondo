import { ApiProperty } from '@nestjs/swagger';

export class ProfileFeatureDto {
  @ApiProperty({ example: 'MBTI 유형' })
  key: string;

  @ApiProperty({ example: 'ISTJ' })
  value: string;
}

export class TraitQnADto {
  @ApiProperty({ example: '연애할 때 상대방에게 의지하는 편이에요?' })
  question: string;

  @ApiProperty({ example: '거의 의지하지 않아요' })
  answer: string;
}

export class SimpleProfileDto {
  @ApiProperty({ example: '오성균' })
  이름: string;

  @ApiProperty({ example: 'MALE' })
  성별: string;

  @ApiProperty({ example: '1982-06-08T00:00:00.000Z', type: String, format: 'date-time' })
  생년월일: Date;

  @ApiProperty({ type: [ProfileFeatureDto] })
  특징: ProfileFeatureDto[];

  @ApiProperty({
    type: Object,
    required: false,
    example: {
      '애착/신뢰도': [
        { question: '연애할 때 상대방에게 의지하는 편이에요?', answer: '거의 의지하지 않아요' },
      ],
    },
  })
  trait_qna?: Record<string, TraitQnADto[]>;
}
