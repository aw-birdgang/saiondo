import { createWinstonLogger } from '@common/logger/winston.logger';

const logger = createWinstonLogger('LLMResponseUtil');

export class LLMResponseUtil {
  /**
   * LLM 응답을 안전하게 JSON으로 파싱
   */
  static parseResponse(response: any): any {
    try {
      logger.debug(`[LLMResponseUtil] 파싱 시작: response 타입=${typeof response}`);
      
      if (typeof response === 'string') {
        logger.debug(`[LLMResponseUtil] 문자열 응답 파싱: 길이=${response.length}`);
        const parsed = JSON.parse(response);
        logger.debug(`[LLMResponseUtil] 문자열 파싱 성공: ${JSON.stringify(parsed).substring(0, 200)}...`);
        return parsed;
      } else if (response && typeof response.response === 'string') {
        logger.debug(`[LLMResponseUtil] response.response 문자열 파싱: 길이=${response.response.length}`);
        const parsed = JSON.parse(response.response);
        logger.debug(`[LLMResponseUtil] response.response 파싱 성공: ${JSON.stringify(parsed).substring(0, 200)}...`);
        return parsed;
      } else if (response && typeof response === 'object') {
        // 중첩된 response 구조 처리 추가
        if (response.response && typeof response.response === 'object') {
          logger.debug(`[LLMResponseUtil] 중첩된 response 객체 처리: ${JSON.stringify(response.response).substring(0, 200)}...`);
          return response.response;
        }
        logger.debug(`[LLMResponseUtil] 객체 응답 그대로 반환: ${JSON.stringify(response).substring(0, 200)}...`);
        return response;
      } else {
        logger.warn(`[LLMResponseUtil] 지원하지 않는 응답 형식: ${typeof response}`);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      logger.error(`[LLMResponseUtil] JSON 파싱 실패: response=${JSON.stringify(response).substring(0, 200)}...`, error);
      return {};
    }
  }

  /**
   * LLM 응답에서 특정 필드를 안전하게 추출
   */
  static getField(response: any, field: string, defaultValue: any = null): any {
    try {
      const parsed = this.parseResponse(response);
      const result = parsed[field] ?? defaultValue;
      logger.debug(`[LLMResponseUtil] 필드 추출: field=${field}, result=${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`[LLMResponseUtil] 필드 추출 실패: field=${field}`, error);
      return defaultValue;
    }
  }

  /**
   * LLM 응답에서 여러 필드를 한 번에 추출
   */
  static getFields(response: any, fields: Record<string, any>): Record<string, any> {
    try {
      const parsed = this.parseResponse(response);
      const result: Record<string, any> = {};

      for (const [field, defaultValue] of Object.entries(fields)) {
        result[field] = parsed[field] ?? defaultValue;
      }

      logger.debug(`[LLMResponseUtil] 다중 필드 추출 완료: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`[LLMResponseUtil] 다중 필드 추출 실패: fields=${JSON.stringify(fields)}`, error);
      return fields; // 기본값 반환
    }
  }

  /**
   * LLM 응답 유효성 검사
   */
  static isValidResponse(response: any): boolean {
    try {
      const parsed = this.parseResponse(response);
      return parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0;
    } catch (error) {
      logger.warn(`[LLMResponseUtil] 응답 유효성 검사 실패: ${error}`);
      return false;
    }
  }

  /**
   * LLM 응답에서 에러 메시지 추출
   */
  static extractErrorMessage(response: any): string {
    try {
      const parsed = this.parseResponse(response);
      return parsed.error || parsed.message || parsed.feedback || '알 수 없는 오류';
    } catch (error) {
      logger.error(`[LLMResponseUtil] 에러 메시지 추출 실패: ${error}`);
      return '응답 파싱 실패';
    }
  }
}
