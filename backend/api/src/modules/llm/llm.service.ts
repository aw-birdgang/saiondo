import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {ConfigService} from '@nestjs/config';
import {AllConfigType} from '../../config/config.type';
import {AnalyzeRequestDto} from './dto/analyze.dto';
import {AnalyzeAnswerDto} from '@modules/llm/dto/analyze-answer.dto';
import { 
  loadPromptTemplate, 
  fillPromptTemplate 
} from "@common/utils/prompt.util";
import { summarizeChatHistory } from "@common/utils/chat.util";
import {SuggestedFieldsService} from '../suggested-fields/suggested-fields.service';
import {ChatQARelationshipCoachRequestDto} from "@modules/chat/dto/chat_qa_relationship-coach.dto";
import { createWinstonLogger } from '@common/logger/winston.logger';

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
  private readonly logger = createWinstonLogger(LlmService.name);

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly suggestedFieldsService: SuggestedFieldsService,
  ) {
    this.llmApiUrl = configService.getOrThrow('common', {
      infer: true,
    }).llmApiUrl;
    this.logger.log(`[LLM] 서비스 초기화 완료: API URL=${this.llmApiUrl}`);
  }

  /**
   * 프롬프트를 LLM 서버로 전달하여 답변을 받음
   * @param prompt 사용자 입력 프롬프트
   * @param model 사용할 LLM 모델(openai, claude 등)
   */
  async forwardToLLM(prompt: string, model: 'openai' | 'claude'): Promise<string> {
    try {
      this.logger.log(`[LLM] forwardToLLM 요청: model=${model}, prompt 길이=${prompt.length}`);
      this.logger.debug(`[LLM] forwardToLLM 프롬프트: ${prompt.substring(0, 200)}...`);
      
      const requestData = { prompt, model };
      this.logger.debug(`[LLM] forwardToLLM 요청 데이터: ${JSON.stringify(requestData)}`);
      
      const { data } = await axios.post(`${this.llmApiUrl}/chat`, requestData);
      
      this.logger.log(`[LLM] forwardToLLM 응답 성공: 응답 타입=${typeof data.response}, 응답 길이=${data.response?.length || 'N/A'}`);
      this.logger.debug(`[LLM] forwardToLLM 응답 데이터: ${JSON.stringify(data).substring(0, 500)}...`);
      
      return data.response;
    } catch (error: any) {
      this.logger.error(`[LLM] forwardToLLM 호출 실패: model=${model}, error=${error.message}`, error);
      throw error;
    }
  }

  async forwardToLLMQAForChatRelationshipCoach(
    body: ChatQARelationshipCoachRequestDto
  ): Promise<string> {
    try {
      this.logger.log(`[LLM] RelationshipCoach 요청: model=${body.model}, messages 개수=${body.messages.length}`);
      
      // 프롬프트 템플릿 로드 및 변수 치환
      let systemPrompt = loadPromptTemplate('chat_qa_relationship_coach');
      systemPrompt = systemPrompt
        .replace('{{profile}}', JSON.stringify(body.profile))
        .replace('{{chat_history}}', summarizeChatHistory(body.chat_history));

      this.logger.debug(`[LLM] RelationshipCoach 시스템 프롬프트: ${systemPrompt.substring(0, 300)}...`);

      // 메시지 배열 구성
      const messages = [
        { role: 'system', content: systemPrompt },
        ...body.messages,
      ];
      
      this.logger.debug(`[LLM] RelationshipCoach 메시지 배열: ${JSON.stringify(messages, null, 2)}`);
      
      const requestData = {
        messages,
        model: body.model,
        response_format: { type: "json_object" }
      };
      
      this.logger.debug(`[LLM] RelationshipCoach 요청 데이터: ${JSON.stringify(requestData)}`);
      
      const { data } = await axios.post(`${this.llmApiUrl}/chat-relationship-coach`, requestData);
      
      this.logger.log(`[LLM] RelationshipCoach 응답 성공: 응답 타입=${typeof data.response}, 응답 길이=${data.response?.length || 'N/A'}`);
      this.logger.debug(`[LLM] RelationshipCoach 응답 데이터: ${JSON.stringify(data).substring(0, 500)}...`);
      
      return data.response;
    } catch (error: any) {
      this.logger.error(`[LLM] RelationshipCoach 호출 실패: model=${body.model}, error=${error.message}`, error);
      throw error;
    }
  }

  /**
   * 커스텀 분석 요청 (예: 성향 분석, 매칭 분석 등)
   * @param data AnalyzeRequestDto
   */
  async analyze(data: AnalyzeRequestDto | AnalyzeAnswerDto): Promise<any> {
    try {
      this.logger.log(`[LLM] analyze 요청: answer 길이=${'answer' in data ? data.answer?.length || 'N/A' : 'N/A'}`);
      this.logger.debug(`[LLM] analyze 요청 데이터: ${JSON.stringify(data).substring(0, 300)}...`);
      
      const { data: res } = await axios.post(`${this.llmApiUrl}/analyze`, data);
      
      this.logger.log(`[LLM] analyze 응답 성공: 응답 타입=${typeof res}, 응답 키=${Object.keys(res || {}).join(', ')}`);
      this.logger.debug(`[LLM] analyze 응답 데이터: ${JSON.stringify(res).substring(0, 500)}...`);
      
      return res;
    } catch (error: any) {
      this.logger.error(`[LLM] analyze 호출 실패: error=${error.message}`, error);
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
      this.logger.log(`[LLM] getFeedback 요청: roomId=${roomId}, message 길이=${message.length}`);
      this.logger.debug(`[LLM] getFeedback 메시지: ${message.substring(0, 200)}...`);
      
      const requestData = { message, roomId };
      this.logger.debug(`[LLM] getFeedback 요청 데이터: ${JSON.stringify(requestData)}`);
      
      const { data } = await axios.post(`${this.llmApiUrl}/feedback`, requestData);
      
      this.logger.log(`[LLM] getFeedback 응답 성공: 응답 타입=${typeof data.response}, 응답 길이=${data.response?.length || 'N/A'}`);
      this.logger.debug(`[LLM] getFeedback 응답 데이터: ${JSON.stringify(data).substring(0, 500)}...`);
      
      return data.response;
    } catch (error: any) {
      this.logger.error(`[LLM] getFeedback 호출 실패: roomId=${roomId}, error=${error.message}`, error);
      
      // fallback: /chat 엔드포인트 사용
      try {
        this.logger.log(`[LLM] getFeedback fallback 시도: /chat 엔드포인트 사용`);
        
        const { data: fallback } = await axios.post(`${this.llmApiUrl}/chat`, {
          prompt: message,
          model: 'openai', // 기본 모델 지정
        });
        
        this.logger.log(`[LLM] getFeedback fallback 성공: 응답 길이=${fallback.response?.length || 'N/A'}`);
        return fallback.response;
      } catch (fallbackError: any) {
        this.logger.error(`[LLM] getFeedback fallback 실패: error=${fallbackError.message}`, fallbackError);
        throw fallbackError;
      }
    }
  }

  async analyzeCouple(prompt: string): Promise<string> {
    try {
      this.logger.log(`[LLM] analyzeCouple 요청: prompt 길이=${prompt.length}`);
      this.logger.debug(`[LLM] analyzeCouple 프롬프트: ${prompt.substring(0, 300)}...`);
      
      const requestData = { prompt };
      this.logger.debug(`[LLM] analyzeCouple 요청 데이터: ${JSON.stringify(requestData)}`);
      
      const { data } = await axios.post(`${this.llmApiUrl}/couple-analysis`, requestData);
      
      this.logger.log(`[LLM] analyzeCouple 응답 성공: 응답 타입=${typeof data.response}, 응답 길이=${data.response?.length || 'N/A'}`);
      this.logger.debug(`[LLM] analyzeCouple 응답 데이터: ${JSON.stringify(data).substring(0, 500)}...`);
      
      return data.response;
    } catch (error: any) {
      this.logger.error(`[LLM] analyzeCouple 호출 실패: error=${error.message}`, error);
      throw error;
    }
  }
}
