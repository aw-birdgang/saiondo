import { ApiProperty } from '@nestjs/swagger';
import { LLMMessageDto } from "@modules/llm/dto/llm-message.dto";
import { IsArray, IsEnum, ValidateNested, IsObject, IsString } from "class-validator";
import { Type } from "class-transformer";
import { SimpleProfileDto } from './simple-profile.dto';

// 특징 및 trait_qna 타입 별도 선언(재사용성, 가독성 향상)
type ProfileFeature = { key: string; value: string };
type TraitQnA = Record<string, { question: string; answer: string }[]>;

export interface SimpleProfile {
  이름: string;
  성별: string;
  생년월일: Date;
  특징: ProfileFeature[];
  trait_qna?: TraitQnA;
}

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
    example: {
      me: {
        이름: "오성균",
        성별: "MALE",
        생년월일: "1982-06-08T00:00:00.000Z",
        특징: [
          { key: "MBTI 유형", value: "ISTJ" }
        ],
        trait_qna: {
          "애착/신뢰도": [
            { question: "연애할 때 상대방에게 의지하는 편이에요?", answer: "거의 의지하지 않아요" }
          ]
        }
      },
      partner: {
        이름: "최지우",
        성별: "FEMALE",
        생년월일: "1982-05-18T00:00:00.000Z",
        특징: [
          { key: "MBTI 유형", value: "ESFJ" }
        ],
        trait_qna: {
          "애착/신뢰도": [
            { question: "연애할 때 상대방에게 의지하는 편이에요?", answer: "네, 많이 의지해요" }
          ]
        }
      }
    }
  })
  @ValidateNested()
  @Type(() => SimpleProfileDto)
  profile: {
    me: SimpleProfileDto;
    partner: SimpleProfileDto;
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
