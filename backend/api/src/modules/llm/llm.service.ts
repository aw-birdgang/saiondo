import {Injectable, Logger} from '@nestjs/common';
import axios from 'axios';
import {ConfigService} from '@nestjs/config';
import {AllConfigType} from '../../config/config.type';
import {AnalyzeRequestDto} from './dto/analyze.dto';
import {AnalyzeAnswerDto} from '@modules/llm/dto/analyze-answer.dto';
import {summarizeChatHistory} from "@common/utils/chat_history.util";
import {SuggestedFieldsService} from '../suggested-fields/suggested-fields.service';
import {loadPromptTemplate} from "@common/utils/prompt-loader.util";
import {ChatQARelationshipCoachRequestDto} from "@modules/chat/dto/chat_qa_relationship-coach.dto";

/**
 * LlmService는 API 서버에서 LLM 서버(FastAPI)로의 모든 연동을 담당합니다.
 * - 프롬프트 기반 채팅
 * - 커스텀 분석 요청
 * - 답변 분석
 * - 피드백 요청 등
 */
@Injectable()
export class LlmService {
  private readonly llmApiUrl: string;
  private readonly logger = new Logger(LlmService.name);

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly suggestedFieldsService: SuggestedFieldsService,
  ) {
    this.llmApiUrl = configService.getOrThrow('common', {
      infer: true,
    }).llmApiUrl;
  }

  /**
   * 프롬프트를 LLM 서버로 전달하여 답변을 받음
   * @param prompt 사용자 입력 프롬프트
   * @param model 사용할 LLM 모델(openai, claude 등)
   */
  async forwardToLLM(prompt: string, model: 'openai' | 'claude'): Promise<string> {
    try {
      const { data } = await axios.post(`${this.llmApiUrl}/chat`, {
        prompt,
        model,
      });
      return data.response;
    } catch (error: any) {
      this.logger.error('LLM 호출 실패:', error.message);
      throw error;
    }
  }


  async forwardToLLMQAForChatRelationshipCoach(
    body: ChatQARelationshipCoachRequestDto
  ): Promise<string> {
    // 프롬프트 템플릿 로드 및 변수 치환
    let systemPrompt = loadPromptTemplate('chat_qa_relationship_coach');
    systemPrompt = systemPrompt
      .replace('{{profile}}', JSON.stringify(body.profile))
      .replace('{{chat_history}}', summarizeChatHistory(body.chat_history));

    // 메시지 배열 구성
    const messages = [
      { role: 'system', content: systemPrompt },
      ...body.messages,
    ];
    this.logger.log('[LLM][RelationshipCoach] messages:', JSON.stringify(messages, null, 2));
    try {
      const { data } = await axios.post(`${this.llmApiUrl}/chat-relationship-coach`, {
        messages,
        model: body.model,
        response_format: { type: "json_object" }
      });
      this.logger.log('[LLM][RelationshipCoach] response:', JSON.stringify(data, null, 2));
      return data.response;
    } catch (error: any) {
      this.logger.error('LLM relationship coach 호출 실패:', error.message);
      throw error;
    }
  }

  /**
   * 커스텀 분석 요청 (예: 성향 분석, 매칭 분석 등)
   * @param data AnalyzeRequestDto
   */
  async analyze(data: AnalyzeRequestDto | AnalyzeAnswerDto): Promise<any> {
    try {
      const { data: res } = await axios.post(`${this.llmApiUrl}/analyze`, data);
      return res;
    } catch (error: any) {
      this.logger.error('LLM 분석 요청 실패:', error.message);
      throw error;
    }
  }

  /**
   * 채팅 메시지에 대한 LLM 피드백 요청
   * @param message 사용자 메시지
   * @param roomId Room 식별자(컨텍스트 활용 가능)
   */
  async getFeedback(message: string, roomId: string): Promise<string> {
    try {
      const { data } = await axios.post(`${this.llmApiUrl}/feedback`, {
        message,
        roomId,
      });
      return data.response;
    } catch (error: any) {
      this.logger.error('LLM 피드백 요청 실패:', error.message);
      // fallback: /chat 엔드포인트 사용
      try {
        const { data: fallback } = await axios.post(`${this.llmApiUrl}/chat`, {
          prompt: message,
          model: 'openai', // 기본 모델 지정
        });
        return fallback.response;
      } catch (fallbackError: any) {
        this.logger.error('LLM fallback 호출 실패:', fallbackError.message);
        throw fallbackError;
      }
    }
  }

  async analyzeCouple(prompt: string): Promise<string> {
    try {
      const { data } = await axios.post(`${this.llmApiUrl}/couple-analysis`, {
        prompt,
      });
      return data.response;
    } catch (error: any) {
      this.logger.error('LLM 커플 분석 호출 실패:', error.message);
      throw error;
    }
  }

}
