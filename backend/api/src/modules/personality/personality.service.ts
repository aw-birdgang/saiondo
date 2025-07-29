import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { PersonaProfileService } from '../persona-profile/persona-profile.service';
import { CoupleAnalysisService } from '../couple-analysis/couple-analysis.service';
import { AdviceService } from '../advice/advice.service';
import {
  AnalyzeBehaviorRequestDto,
  AnalyzeBehaviorResponseDto,
  AnalyzeCommunicationRequestDto,
  AnalyzeCommunicationResponseDto,
  AnalyzeConversationRequestDto,
  AnalyzeConversationResponseDto,
  AnalyzeEmotionRequestDto,
  AnalyzeEmotionResponseDto,
  AnalyzeLoveLanguageRequestDto,
  AnalyzeLoveLanguageResponseDto,
  AnalyzeMbtiRequestDto,
  AnalyzeMbtiResponseDto,
  ChatbotDetectRequestDto,
  ChatbotDetectResponseDto,
  FeedbackRequestDto,
  FeedbackResponseDto,
} from './dto';
import { LLMResponseUtil } from '../../common/utils/llm-response.util';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class PersonalityService {
  private readonly logger = createWinstonLogger(PersonalityService.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly personaProfileService: PersonaProfileService,
    private readonly coupleAnalysisService: CoupleAnalysisService,
    private readonly adviceService: AdviceService,
  ) {}

  async analyzeConversation(
    body: AnalyzeConversationRequestDto,
  ): Promise<AnalyzeConversationResponseDto> {
    try {
      this.logger.log(
        `[Personality] 대화 분석 시작: userId=${body.userId}, partnerId=${body.partnerId ?? '없음'}`,
      );

      const prompt = `당신은 전문적인 성향 분석가입니다.

[분석할 대화]
사용자: ${body.userId}
상대방: ${body.partnerId ?? '없음'}
대화 내용:
${body.messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}

[분석 요청]
위 대화를 분석하여 다음을 파악해주세요:
1. 사용자의 주요 성향 특성
2. 개선을 위한 구체적인 피드백
3. 전체적인 분석 점수 (0.0-1.0)

[응답 형식]
JSON 형식으로만 응답하세요:
{
  "personalityTraits": {
    "trait": "실제 분석된 성향",
    "score": 0.0-1.0
  },
  "feedback": "대화 내용을 바탕으로 한 구체적인 피드백",
  "score": 0.0-1.0
}`;

      this.logger.log(`[Personality] LLM 요청 프롬프트: ${prompt.substring(0, 200)}...`);

      const response = await this.llmService.analyze({ answer: prompt });

      this.logger.log(`[Personality] LLM 원본 응답: ${JSON.stringify(response)}`);
      this.logger.log(
        `[Personality] LLM 응답 타입: ${typeof response}, 응답 길이: ${typeof response === 'string' ? response.length : 'N/A'}`,
      );

      const result = LLMResponseUtil.getFields(response, {
        personalityTraits: {},
        feedback: '',
        score: 0.8,
      });

      this.logger.log(`[Personality] 파싱된 결과: ${JSON.stringify(result)}`);

      const finalResult = {
        personalityTraits: result.personalityTraits,
        feedback: result.feedback,
        score: result.score,
      };

      this.logger.log(`[Personality] 대화 분석 완료: ${JSON.stringify(finalResult)}`);

      return finalResult;
    } catch (error) {
      this.logger.error(`[Personality] 대화 분석 실패: userId=${body.userId}`, error);

      return {
        personalityTraits: { trait: '분석 실패', score: 0.5 },
        feedback: '분석 중 오류가 발생했습니다.',
        score: 0.5,
      };
    }
  }

  async analyzeMbti(body: AnalyzeMbtiRequestDto): Promise<AnalyzeMbtiResponseDto> {
    try {
      this.logger.log(`[Personality] MBTI 분석 시작: userId=${body.userId}`);

      const prompt = `당신은 전문적인 MBTI 분석가입니다.

[분석할 데이터]
사용자: ${body.userId}
설문 답변: ${JSON.stringify(body.data.answers)}
대화 샘플: ${JSON.stringify(body.data.conversation_samples)}

[분석 요청]
위 데이터를 기반으로 MBTI를 분석해주세요.

[응답 형식]
JSON 형식으로만 응답하세요:
{
  "mbti": "분석된 MBTI 유형",
  "description": "MBTI 특성에 대한 설명",
  "match": {
    "best": "가장 잘 맞는 MBTI",
    "worst": "가장 잘 맞지 않는 MBTI"
  }
}`;

      this.logger.log(`[Personality] MBTI LLM 요청 프롬프트: ${prompt.substring(0, 200)}...`);

      const response = await this.llmService.analyze({ answer: prompt });

      this.logger.log(`[Personality] MBTI LLM 원본 응답: ${JSON.stringify(response)}`);
      this.logger.log(
        `[Personality] MBTI LLM 응답 타입: ${typeof response}, 응답 길이: ${typeof response === 'string' ? response.length : 'N/A'}`,
      );

      const result = LLMResponseUtil.getFields(response, {
        mbti: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        match: {},
      });

      this.logger.log(`[Personality] MBTI 파싱된 결과: ${JSON.stringify(result)}`);

      const finalResult = {
        mbti: result.mbti,
        description: result.description,
        match: result.match,
      };

      this.logger.log(`[Personality] MBTI 분석 완료: ${JSON.stringify(finalResult)}`);

      return finalResult;
    } catch (error) {
      this.logger.error(`[Personality] MBTI 분석 실패: userId=${body.userId}`, error);

      return {
        mbti: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        match: {},
      };
    }
  }

  async analyzeCommunication(
    body: AnalyzeCommunicationRequestDto,
  ): Promise<AnalyzeCommunicationResponseDto> {
    try {
      this.logger.log(`[Personality] 소통 스타일 분석 시작: userId=${body.userId}`);

      const prompt = `당신은 전문적인 소통 스타일 분석가입니다.

[분석할 대화]
사용자: ${body.userId}
대화: ${JSON.stringify(body.messages)}

[분석 요청]
위 대화를 분석하여 소통 스타일을 파악해주세요.

[응답 형식]
JSON 형식으로만 응답하세요:
{
  "style": "분석된 소통 스타일",
  "description": "소통 스타일에 대한 설명",
  "feedback": "개선을 위한 피드백"
}`;

      this.logger.log(
        `[Personality] 소통 스타일 LLM 요청 프롬프트: ${prompt.substring(0, 200)}...`,
      );

      const response = await this.llmService.analyze({ answer: prompt });

      this.logger.log(`[Personality] 소통 스타일 LLM 원본 응답: ${JSON.stringify(response)}`);
      this.logger.log(
        `[Personality] 소통 스타일 LLM 응답 타입: ${typeof response}, 응답 길이: ${typeof response === 'string' ? response.length : 'N/A'}`,
      );

      const result = LLMResponseUtil.getFields(response, {
        style: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        feedback: '',
      });

      this.logger.log(`[Personality] 소통 스타일 파싱된 결과: ${JSON.stringify(result)}`);

      const finalResult = {
        style: result.style,
        description: result.description,
        feedback: result.feedback,
      };

      this.logger.log(`[Personality] 소통 스타일 분석 완료: ${JSON.stringify(finalResult)}`);

      return finalResult;
    } catch (error) {
      this.logger.error(`[Personality] 소통 스타일 분석 실패: userId=${body.userId}`, error);

      return {
        style: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        feedback: '',
      };
    }
  }

  async analyzeLoveLanguage(
    body: AnalyzeLoveLanguageRequestDto,
  ): Promise<AnalyzeLoveLanguageResponseDto> {
    try {
      this.logger.log(`[Personality] 사랑의 언어 분석 시작: userId=${body.userId}`);

      const prompt = `당신은 전문적인 사랑의 언어 분석가입니다.

[분석할 데이터]
사용자: ${body.userId}
데이터: ${JSON.stringify(body.data)}

[분석 요청]
위 데이터를 기반으로 사랑의 언어를 분석해주세요.

[응답 형식]
JSON 형식으로만 응답하세요:
{
  "mainLanguage": "주요 사랑의 언어",
  "description": "사랑의 언어에 대한 설명",
  "match": {
    "best": "가장 잘 맞는 사랑의 언어",
    "worst": "가장 잘 맞지 않는 사랑의 언어"
  }
}`;

      this.logger.log(
        `[Personality] 사랑의 언어 LLM 요청 프롬프트: ${prompt.substring(0, 200)}...`,
      );

      const response = await this.llmService.analyze({ answer: prompt });

      this.logger.log(`[Personality] 사랑의 언어 LLM 원본 응답: ${JSON.stringify(response)}`);
      this.logger.log(
        `[Personality] 사랑의 언어 LLM 응답 타입: ${typeof response}, 응답 길이: ${typeof response === 'string' ? response.length : 'N/A'}`,
      );

      const result = LLMResponseUtil.getFields(response, {
        mainLanguage: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        match: {},
      });

      this.logger.log(`[Personality] 사랑의 언어 파싱된 결과: ${JSON.stringify(result)}`);

      const finalResult = {
        mainLanguage: result.mainLanguage,
        description: result.description,
        match: result.match,
      };

      this.logger.log(`[Personality] 사랑의 언어 분석 완료: ${JSON.stringify(finalResult)}`);

      return finalResult;
    } catch (error) {
      this.logger.error(`[Personality] 사랑의 언어 분석 실패: userId=${body.userId}`, error);

      return {
        mainLanguage: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        match: {},
      };
    }
  }

  async analyzeBehavior(body: AnalyzeBehaviorRequestDto): Promise<AnalyzeBehaviorResponseDto> {
    try {
      this.logger.log(`[Personality] 행동 패턴 분석 시작: userId=${body.userId}`);

      const prompt = `당신은 전문적인 행동 패턴 분석가입니다.

[분석할 데이터]
사용자: ${body.userId}
데이터: ${JSON.stringify(body.data)}

[분석 요청]
위 행동 데이터를 분석하여 패턴을 파악해주세요.

[응답 형식]
JSON 형식으로만 응답하세요:
{
  "pattern": "분석된 행동 패턴",
  "description": "행동 패턴에 대한 설명",
  "recommendation": "개선을 위한 권장사항"
}`;

      this.logger.log(`[Personality] 행동 패턴 LLM 요청 프롬프트: ${prompt.substring(0, 200)}...`);

      const response = await this.llmService.analyze({ answer: prompt });

      this.logger.log(`[Personality] 행동 패턴 LLM 원본 응답: ${JSON.stringify(response)}`);
      this.logger.log(
        `[Personality] 행동 패턴 LLM 응답 타입: ${typeof response}, 응답 길이: ${typeof response === 'string' ? response.length : 'N/A'}`,
      );

      const result = LLMResponseUtil.getFields(response, {
        pattern: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        recommendation: '',
      });

      this.logger.log(`[Personality] 행동 패턴 파싱된 결과: ${JSON.stringify(result)}`);

      const finalResult = {
        pattern: result.pattern,
        description: result.description,
        recommendation: result.recommendation,
      };

      this.logger.log(`[Personality] 행동 패턴 분석 완료: ${JSON.stringify(finalResult)}`);

      return finalResult;
    } catch (error) {
      this.logger.error(`[Personality] 행동 패턴 분석 실패: userId=${body.userId}`, error);

      return {
        pattern: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        recommendation: '',
      };
    }
  }

  async analyzeEmotion(body: AnalyzeEmotionRequestDto): Promise<AnalyzeEmotionResponseDto> {
    try {
      this.logger.log(`[Personality] 감정 상태 분석 시작: userId=${body.userId}`);

      const prompt = `당신은 전문적인 감정 상태 분석가입니다.

[분석할 대화]
사용자: ${body.userId}
대화: ${JSON.stringify(body.messages)}

[분석 요청]
위 대화를 분석하여 감정 상태를 파악해주세요.

[응답 형식]
JSON 형식으로만 응답하세요:
{
  "emotion": "분석된 감정 상태",
  "description": "감정 상태에 대한 설명",
  "feedback": "감정 관리를 위한 피드백"
}`;

      this.logger.log(`[Personality] 감정 상태 LLM 요청 프롬프트: ${prompt.substring(0, 200)}...`);

      const response = await this.llmService.analyze({ answer: prompt });

      this.logger.log(`[Personality] 감정 상태 LLM 원본 응답: ${JSON.stringify(response)}`);
      this.logger.log(
        `[Personality] 감정 상태 LLM 응답 타입: ${typeof response}, 응답 길이: ${typeof response === 'string' ? response.length : 'N/A'}`,
      );

      const result = LLMResponseUtil.getFields(response, {
        emotion: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        feedback: '',
      });

      this.logger.log(`[Personality] 감정 상태 파싱된 결과: ${JSON.stringify(result)}`);

      const finalResult = {
        emotion: result.emotion,
        description: result.description,
        feedback: result.feedback,
      };

      this.logger.log(`[Personality] 감정 상태 분석 완료: ${JSON.stringify(finalResult)}`);

      return finalResult;
    } catch (error) {
      this.logger.error(`[Personality] 감정 상태 분석 실패: userId=${body.userId}`, error);

      return {
        emotion: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        feedback: '',
      };
    }
  }

  async getProfile(userId: string) {
    this.logger.log(`[Personality] 프로필 조회: userId=${userId}`);

    return this.personaProfileService.findByUserId(userId);
  }

  async updateProfile(body: any) {
    this.logger.log(
      `[Personality] 프로필 업데이트: userId=${body.userId}, categoryCodeId=${body.categoryCodeId}`,
    );

    return this.personaProfileService.update(body.userId, body.categoryCodeId, body);
  }

  async getRelationshipReport(channelId: string) {
    this.logger.log(`[Personality] 관계 리포트 조회: channelId=${channelId}`);

    return this.coupleAnalysisService.getLatestAnalysis(channelId);
  }

  async chatbotDetect(body: ChatbotDetectRequestDto): Promise<ChatbotDetectResponseDto> {
    try {
      this.logger.log(`[Personality] 챗봇 탐지 시작: userId=${body.userId}`);

      const prompt = `당신은 전문적인 챗봇 탐지 분석가입니다.

[분석할 대화]
사용자: ${body.userId}
대화: ${JSON.stringify(body.messages)}

[분석 요청]
위 챗봇 대화를 분석하여 성향을 탐지해주세요.

[응답 형식]
JSON 형식으로만 응답하세요:
{
  "detectedTraits": {
    "trait": "탐지된 성향 특성",
    "score": 0.0-1.0
  },
  "feedback": "탐지 결과에 대한 피드백"
}`;

      this.logger.log(`[Personality] 챗봇 탐지 LLM 요청 프롬프트: ${prompt.substring(0, 200)}...`);

      const response = await this.llmService.analyze({ answer: prompt });

      this.logger.log(`[Personality] 챗봇 탐지 LLM 원본 응답: ${JSON.stringify(response)}`);
      this.logger.log(
        `[Personality] 챗봇 탐지 LLM 응답 타입: ${typeof response}, 응답 길이: ${typeof response === 'string' ? response.length : 'N/A'}`,
      );

      const result = LLMResponseUtil.getFields(response, {
        detectedTraits: {},
        feedback: '',
      });

      this.logger.log(`[Personality] 챗봇 탐지 파싱된 결과: ${JSON.stringify(result)}`);

      const finalResult = {
        detectedTraits: result.detectedTraits,
        feedback: result.feedback,
      };

      this.logger.log(`[Personality] 챗봇 탐지 완료: ${JSON.stringify(finalResult)}`);

      return finalResult;
    } catch (error) {
      this.logger.error(`[Personality] 챗봇 탐지 실패: userId=${body.userId}`, error);

      return {
        detectedTraits: { trait: '분석 실패', score: 0.5 },
        feedback: '분석 중 오류가 발생했습니다.',
      };
    }
  }

  async feedback(body: FeedbackRequestDto): Promise<FeedbackResponseDto> {
    try {
      this.logger.log(
        `[Personality] 피드백 생성 시작: userId=${body.userId}, partnerId=${body.partnerId ?? '없음'}`,
      );

      const prompt = `당신은 전문적인 관계 상담사입니다.

[분석할 상황]
사용자: ${body.userId}
상대방: ${body.partnerId ?? '없음'}
상황: ${JSON.stringify(body.data)}

[분석 요청]
위 상황을 기반으로 피드백을 생성해주세요.

[응답 형식]
JSON 형식으로만 응답하세요:
{
  "feedback": "상황에 대한 구체적인 피드백",
  "recommendation": "개선을 위한 권장사항"
}`;

      this.logger.log(`[Personality] 피드백 LLM 요청 프롬프트: ${prompt.substring(0, 200)}...`);

      const response = await this.llmService.analyze({ answer: prompt });

      this.logger.log(`[Personality] 피드백 LLM 원본 응답: ${JSON.stringify(response)}`);
      this.logger.log(
        `[Personality] 피드백 LLM 응답 타입: ${typeof response}, 응답 길이: ${typeof response === 'string' ? response.length : 'N/A'}`,
      );

      const result = LLMResponseUtil.getFields(response, {
        feedback: '분석 중 오류가 발생했습니다.',
        recommendation: '',
      });

      this.logger.log(`[Personality] 피드백 파싱된 결과: ${JSON.stringify(result)}`);

      const finalResult = {
        feedback: result.feedback,
        recommendation: result.recommendation,
      };

      this.logger.log(`[Personality] 피드백 생성 완료: ${JSON.stringify(finalResult)}`);

      return finalResult;
    } catch (error) {
      this.logger.error(`[Personality] 피드백 생성 실패: userId=${body.userId}`, error);

      return {
        feedback: '분석 중 오류가 발생했습니다.',
        recommendation: '',
      };
    }
  }
}
