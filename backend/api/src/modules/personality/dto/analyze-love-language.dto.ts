import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class AnalyzeLoveLanguageRequestDto {
  @ApiProperty({ description: '분석 대상 userId', example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '대화/행동 데이터', example: { actions: ['선물', '칭찬'] } })
  @IsObject()
  data: any;
}

export class AnalyzeLoveLanguageResponseDto {
  @ApiProperty({ description: '주요 사랑의 언어', example: '행동' })
  @IsString()
  mainLanguage: string;

  @ApiProperty({ description: '설명', example: '행동으로 사랑을 표현하는 경향이 강합니다.' })
  @IsString()
  description: string;

  @ApiProperty({ description: '호환성', example: { best: '말', worst: '선물' } })
  match?: any;
}