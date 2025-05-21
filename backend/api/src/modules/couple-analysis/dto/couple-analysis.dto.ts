import { ApiProperty } from '@nestjs/swagger';

export class CreateCoupleAnalysisDto {
  @ApiProperty({ example: '두 분은 최근 대화가 줄고 있습니다.' })
  summary: string;

  @ApiProperty({ example: '서로의 감정을 자주 표현해보세요.' })
  advice: string;

  @ApiProperty({ example: '{"mbti": "INFP", "특징": "..."}', required: false })
  persona1?: string;

  @ApiProperty({ example: '{"mbti": "ESTJ", "특징": "..."}', required: false })
  persona2?: string;

  @ApiProperty({ example: '["신뢰", "대화"]', required: false, type: [String] })
  keywords?: string[];
}
