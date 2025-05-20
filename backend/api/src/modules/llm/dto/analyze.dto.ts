import { IsString, IsIn, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyzeRequestDto {
  @ApiProperty()
  @IsString()
  user_prompt: string;

  @ApiProperty()
  @IsString()
  partner_prompt: string;

  @ApiProperty()
  @IsString()
  @IsIn(['male', 'female'])
  user_gender: 'male' | 'female';

  @ApiProperty()
  @IsString()
  @IsIn(['male', 'female'])
  partner_gender: 'male' | 'female';

  @ApiProperty()
  @IsString()
  @IsIn(['openai', 'claude'])
  model: 'openai' | 'claude';

  @ApiPropertyOptional({
    description: '추가 메타데이터',
    type: 'object',
    example: { sessionId: 'abc123', mbti: 'ENFP', age: 29 },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class AnalyzeResponseDto {
  @ApiProperty()
  user_traits: string;

  @ApiProperty()
  match_result: string;

  @ApiProperty()
  advice: string;
}
