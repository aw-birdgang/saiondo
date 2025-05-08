import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeAnswerDto {
  @ApiProperty()
  answer: string;

  // 필요하다면 추가적인 필드도 선언 가능
  // @ApiProperty({ required: false })
  // userId?: string;
}
