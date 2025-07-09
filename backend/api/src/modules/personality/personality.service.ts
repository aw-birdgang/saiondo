import {Injectable, Logger} from '@nestjs/common';
import {LlmService} from '../llm/llm.service';
import {PersonaProfileService} from '../persona-profile/persona-profile.service';
import {CoupleAnalysisService} from '../couple-analysis/couple-analysis.service';
import {AdviceService} from '../advice/advice.service';
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
import {LLMResponseUtil} from "../../common/utils/llm-response.util";

@Injectable()
export class PersonalityService {
  private readonly logger = new Logger(PersonalityService.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly personaProfileService: PersonaProfileService,
    private readonly coupleAnalysisService: CoupleAnalysisService,
    private readonly adviceService: AdviceService,
  ) {}

  async analyzeConversation(body: AnalyzeConversationRequestDto): Promise<AnalyzeConversationResponseDto> {
    try {
      const prompt = `다음 대화를 분석하여 성향을 파악해주세요:
      사용자: ${body.userId}
      상대방: ${body.partnerId || '없음'}
      대화: ${JSON.stringify(body.messages)}
      
      분석 결과를 다음 JSON 형식으로 반환해주세요:
      {
        "personalityTraits": {"trait": "외향적", "score": 0.8},
        "feedback": "더 자주 감정을 표현해보세요.",
        "score": 0.87
      }`;

      const response = await this.llmService.analyze({ answer: prompt });
      this.logger.log('LLM 응답:', response);

      const result = LLMResponseUtil.getFields(response, {
        personalityTraits: {},
        feedback: '',
        score: 0.8,
      });

      return {
        personalityTraits: result.personalityTraits,
        feedback: result.feedback,
        score: result.score,
      };
    } catch (error) {
      this.logger.error('대화 분석 실패:', error);
      return {
        personalityTraits: { trait: '분석 실패', score: 0.5 },
        feedback: '분석 중 오류가 발생했습니다.',
        score: 0.5,
      };
    }
  }

  async analyzeMbti(body: AnalyzeMbtiRequestDto): Promise<AnalyzeMbtiResponseDto> {
    try {
      const prompt = `다음 MBTI 설문 데이터를 분석해주세요:
      사용자: ${body.userId}
      설문 답변: ${JSON.stringify(body.data.answers)}
      대화 샘플: ${JSON.stringify(body.data.conversation_samples)}
      
      분석 결과를 다음 JSON 형식으로 반환해주세요:
      {
        "mbti": "INFP",
        "description": "이상주의적이고 감성적입니다.",
        "match": {"best": "ENFJ", "worst": "ESTJ"}
      }`;

      const response = await this.llmService.analyze({ answer: prompt });
      this.logger.log('LLM 응답:', response);

      const result = LLMResponseUtil.getFields(response, {
        mbti: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        match: {},
      });

      return {
        mbti: result.mbti,
        description: result.description,
        match: result.match,
      };
    } catch (error) {
      this.logger.error('MBTI 분석 실패:', error);
      return {
        mbti: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        match: {},
      };
    }
  }

  async analyzeCommunication(body: AnalyzeCommunicationRequestDto): Promise<AnalyzeCommunicationResponseDto> {
    try {
      const prompt = `다음 대화를 분석하여 소통 스타일을 파악해주세요:
      사용자: ${body.userId}
      대화: ${JSON.stringify(body.messages)}
      
      분석 결과를 다음 JSON 형식으로 반환해주세요:
      {
        "style": "직접적/감정적",
        "description": "감정을 솔직하게 표현하는 직접적 스타일입니다.",
        "feedback": "상대방의 입장도 고려해보세요."
      }`;

      const response = await this.llmService.analyze({ answer: prompt });
      const result = LLMResponseUtil.getFields(response, {
        style: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        feedback: '',
      });

      return {
        style: result.style,
        description: result.description,
        feedback: result.feedback,
      };
    } catch (error) {
      this.logger.error('소통 스타일 분석 실패:', error);
      return {
        style: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        feedback: '',
      };
    }
  }

  async analyzeLoveLanguage(body: AnalyzeLoveLanguageRequestDto): Promise<AnalyzeLoveLanguageResponseDto> {
    try {
      const prompt = `다음 데이터를 기반으로 사랑의 언어를 분석해주세요:
      사용자: ${body.userId}
      데이터: ${JSON.stringify(body.data)}
      
      분석 결과를 다음 JSON 형식으로 반환해주세요:
      {
        "mainLanguage": "행동",
        "description": "행동으로 사랑을 표현하는 경향이 강합니다.",
        "match": {"best": "말", "worst": "선물"}
      }`;

      const response = await this.llmService.analyze({ answer: prompt });
      const result = LLMResponseUtil.getFields(response, {
        mainLanguage: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        match: {},
      });

      return {
        mainLanguage: result.mainLanguage,
        description: result.description,
        match: result.match,
      };
    } catch (error) {
      this.logger.error('사랑의 언어 분석 실패:', error);
      return {
        mainLanguage: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        match: {},
      };
    }
  }

  async analyzeBehavior(body: AnalyzeBehaviorRequestDto): Promise<AnalyzeBehaviorResponseDto> {
    try {
      const prompt = `다음 행동 데이터를 분석하여 패턴을 파악해주세요:
      사용자: ${body.userId}
      데이터: ${JSON.stringify(body.data)}
      
      분석 결과를 다음 JSON 형식으로 반환해주세요:
      {
        "pattern": "야간 활동이 많음",
        "description": "주로 밤에 활동하는 경향이 있습니다.",
        "recommendation": "규칙적인 생활을 시도해보세요."
      }`;

      const response = await this.llmService.analyze({ answer: prompt });
      const result = LLMResponseUtil.getFields(response, {
        pattern: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        recommendation: '',
      });

      return {
        pattern: result.pattern,
        description: result.description,
        recommendation: result.recommendation,
      };
    } catch (error) {
      this.logger.error('행동 패턴 분석 실패:', error);
      return {
        pattern: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        recommendation: '',
      };
    }
  }

  async analyzeEmotion(body: AnalyzeEmotionRequestDto): Promise<AnalyzeEmotionResponseDto> {
    try {
      const prompt = `다음 대화를 분석하여 감정 상태를 파악해주세요:
      사용자: ${body.userId}
      대화: ${JSON.stringify(body.messages)}
      
      분석 결과를 다음 JSON 형식으로 반환해주세요:
      {
        "emotion": "스트레스",
        "description": "최근 스트레스가 증가한 상태입니다.",
        "feedback": "충분한 휴식을 취해보세요."
      }`;

      const response = await this.llmService.analyze({ answer: prompt });
      const result = LLMResponseUtil.getFields(response, {
        emotion: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        feedback: '',
      });

      return {
        emotion: result.emotion,
        description: result.description,
        feedback: result.feedback,
      };
    } catch (error) {
      this.logger.error('감정 상태 분석 실패:', error);
      return {
        emotion: '분석 실패',
        description: '분석 중 오류가 발생했습니다.',
        feedback: '',
      };
    }
  }

  async getProfile(userId: string) {
    return this.personaProfileService.findByUserId(userId);
  }

  async updateProfile(body: any) {
    return this.personaProfileService.update(body.userId, body.categoryCodeId, body);
  }

  async getRelationshipReport(channelId: string) {
    return this.coupleAnalysisService.getLatestAnalysis(channelId);
  }

  async chatbotDetect(body: ChatbotDetectRequestDto): Promise<ChatbotDetectResponseDto> {
    try {
      const prompt = `다음 챗봇 대화를 분석하여 성향을 탐지해주세요:
      사용자: ${body.userId}
      대화: ${JSON.stringify(body.messages)}
      
      분석 결과를 다음 JSON 형식으로 반환해주세요:
      {
        "detectedTraits": {"trait": "외향적", "score": 0.7},
        "feedback": "긍정적인 대화를 유지해보세요."
      }`;

      const response = await this.llmService.analyze({ answer: prompt });
      const result = LLMResponseUtil.getFields(response, {
        detectedTraits: {},
        feedback: '',
      });

      return {
        detectedTraits: result.detectedTraits,
        feedback: result.feedback,
      };
    } catch (error) {
      this.logger.error('챗봇 탐지 실패:', error);
      return {
        detectedTraits: { trait: '분석 실패', score: 0.5 },
        feedback: '분석 중 오류가 발생했습니다.',
      };
    }
  }

  async feedback(body: FeedbackRequestDto): Promise<FeedbackResponseDto> {
    try {
      const prompt = `다음 상황을 기반으로 피드백을 생성해주세요:
      사용자: ${body.userId}
      상대방: ${body.partnerId || '없음'}
      상황: ${JSON.stringify(body.data)}
      
      피드백을 다음 JSON 형식으로 반환해주세요:
      {
        "feedback": "서로의 감정을 자주 표현해보세요.",
        "recommendation": "함께 산책을 해보세요."
      }`;

      const response = await this.llmService.analyze({ answer: prompt });
      const result = LLMResponseUtil.getFields(response, {
        feedback: '분석 중 오류가 발생했습니다.',
        recommendation: '',
      });

      return {
        feedback: result.feedback,
        recommendation: result.recommendation,
      };
    } catch (error) {
      this.logger.error('피드백 생성 실패:', error);
      return {
        feedback: '분석 중 오류가 발생했습니다.',
        recommendation: '',
      };
    }
  }
}
