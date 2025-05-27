import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {ConfigService} from '@nestjs/config';
import {AllConfigType} from '../../config/config.type';
import {AnalyzeRequestDto} from './dto/analyze.dto';
import {AnalyzeAnswerDto} from '@modules/llm/dto/analyze-answer.dto';
import {buildHistory, LLMMessage} from "@common/utils/chat_history.util";

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

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    // 환경변수에서 LLM 서버 base URL을 읽어옴
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
      const response = await axios.post(`${this.llmApiUrl}/chat`, {
        prompt,
        model,
      });
      return response.data.response;
    } catch (error: any) {
      console.error('LLM 호출 실패:', error.message);
      throw error;
    }
  }

  /**
   * 메시지 히스토리 기반 LLM 호출 (ask_openai_history)
   * @param messages 전체 메시지 배열
   * @param model 사용할 LLM 모델
   */
  async forwardHistoryToLLM({
    messages,
    model,
  }: {
    messages: LLMMessage[];
    model: 'openai' | 'claude';
  }): Promise<string> {
    const history = buildHistory(messages, 3000);
    console.log('[forwardHistoryToLLM] 최종 LLM 프롬프트 히스토리:', JSON.stringify(history, null, 2));

    try {
      const response = await axios.post(`${this.llmApiUrl}/chat-history`, {
        messages: history,
        model,
      });
      return response.data.response;
    } catch (error: any) {
      console.error('LLM history 호출 실패:', error.message);
      throw error;
    }
  }

  /**
   * 커스텀 분석 요청 (예: 성향 분석, 매칭 분석 등)
   * @param data AnalyzeRequestDto
   */
  async analyze(data: AnalyzeRequestDto): Promise<any> {
    try {
      const response = await axios.post(`${this.llmApiUrl}/analyze`, data);
      return response.data;
    } catch (error: any) {
      console.error('LLM 분석 요청 실패:', error.message);
      throw error;
    }
  }

  /**
   * 답변 분석 요청 (특정 답변에 대한 추가 분석)
   * @param data AnalyzeAnswerDto
   */
  async analyzeAnswer(data: AnalyzeAnswerDto) {
    try {
      const response = await axios.post(`${this.llmApiUrl}/analyze`, data);
      return response.data;
    } catch (error: any) {
      console.error('LLM 분석 요청 실패:', error.message);
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
      // LLM 서버에 피드백 요청 (엔드포인트는 실제 LLM 서버에 맞게 조정)
      const response = await axios.post(`${this.llmApiUrl}/feedback`, {
        message,
        roomId,
      });
      return response.data.response;
    } catch (error: any) {
      // 만약 /feedback 엔드포인트가 없다면, /chat을 재활용하거나, 아래처럼 fallback 처리 가능
      console.error('LLM 피드백 요청 실패:', error.message);
      // fallback: /chat 엔드포인트 사용
      try {
        const fallback = await axios.post(`${this.llmApiUrl}/chat`, {
          prompt: message,
          model: 'openai', // 기본 모델 지정
        });
        return fallback.data.response;
      } catch (fallbackError: any) {
        throw fallbackError;
      }
    }
  }

  /**
   * 채팅 데이터 기반 성향 분석 요청
   * @param chatData 채팅 데이터 배열
   */
  async analyzePersona(chatData: any[]): Promise<any> {
    try {
      const response = await axios.post(`${this.llmApiUrl}/analyze-persona`, {
        chatData,
      });
      return response.data;
    } catch (error: any) {
      console.error('LLM 성향 분석 요청 실패:', error.message);
      throw error;
    }
  }

  async analyzeCouple(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${this.llmApiUrl}/couple-analysis`, {
        prompt,
      });
      return response.data.response;
    } catch (error: any) {
      console.error('LLM 호출 실패:', error.message);
      throw error;
    }
  }

  async adviceCouple(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${this.llmApiUrl}/couple-analysis`, {
        prompt,
      });
      return response.data.response;
    } catch (error: any) {
      console.error('LLM 호출 실패:', error.message);
      throw error;
    }
  }

}
