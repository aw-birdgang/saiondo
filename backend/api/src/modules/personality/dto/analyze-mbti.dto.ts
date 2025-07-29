import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class AnalyzeMbtiRequestDto {
  @ApiProperty({ description: '분석 대상 userId', example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '설문/대화 데이터', example: { answers: [1, 2, 3, 4] } })
  @IsObject()
  data: any;
}

export class AnalyzeMbtiResponseDto {
  @ApiProperty({ description: 'MBTI 유형', example: 'INFP' })
  @IsString()
  mbti: string;

  @ApiProperty({ description: '유형별 설명', example: '이상주의적이고 감성적입니다.' })
  @IsString()
  description: string;

  @ApiProperty({ description: '궁합 정보', example: { best: 'ENFJ', worst: 'ESTJ' } })
  match?: any;
}
