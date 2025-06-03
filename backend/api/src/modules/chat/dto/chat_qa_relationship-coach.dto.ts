import { ApiProperty } from '@nestjs/swagger';
import { LLMMessageDto } from "@modules/llm/dto/llm-message.dto";
import { IsArray, IsEnum, ValidateNested, IsObject, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ChatQARelationshipCoachRequestDto {
  @ApiProperty({
    type: Object,
    example: { name: "profile", fields: [] },
    description: "유저 프로필 등 메모리 스키마 정보"
  })
  @IsObject()
  memory_schema: Record<string, any>;

  @ApiProperty({
    type: Object,
    example: { name: "profile", value: {} }
  })
  profile: {
    me: {
      이름: string;
      성별: string;
      생년월일: string;
      특징: { key: string; value: string }[];
      trait_qna?: Record<string, { question: string; answer: string }[]>;
    };
    partner: {
      이름: string;
      성별: string;
      생년월일: string;
      특징: { key: string; value: string }[];
      trait_qna?: Record<string, { question: string; answer: string }[]>;
    };
  };

  @ApiProperty({
    type: String,
    example: "유저: 여자친구랑 여행을 가야하는데 괜찮은곳 있을까?\nAI: 자연을 즐길 수 있는 제주도나 강원도를 추천해요.",
    description: "최근 대화 내역 (텍스트 변환된 형태)"
  })
  @IsString()
  chat_history: string;

  @ApiProperty({
    example: [
      { role: 'user', content: '요즘 연인과 자주 다퉈요.' },
      { role: 'assistant', content: '무엇 때문에 다투는지 말씀해주실 수 있나요?' },
      { role: 'user', content: '사소한 일로 자주 다퉈요.' }
    ],
    type: [LLMMessageDto],
    description: "대화 메시지 히스토리 (필요시 별도 활용)"
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LLMMessageDto)
  messages: LLMMessageDto[];

  @ApiProperty({ example: 'openai', enum: ['openai', 'claude'], default: 'openai' })
  @IsEnum(['openai', 'claude'])
  model: 'openai' | 'claude';
}

export class RelationshipCoachResponseDto {
  @ApiProperty({ example: '상담 결과 답변' })
  response: string;
}
