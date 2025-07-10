import { createWinstonLogger } from '@common/logger/winston.logger';

const logger = createWinstonLogger('JsonUtil');

/**
 * JSON 코드 블록에서 JSON 추출
 * 여러 형태의 JSON 응답을 안전하게 파싱
 */
export function extractJsonFromCodeBlock(text: string): any | null {
  try {
    // 1. ```json ... ``` 형태 파싱
    const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      try {
        return JSON.parse(jsonBlockMatch[1]);
      } catch (parseError) {
        // JSON 블록 내에서 중괄호만 추출하여 재시도
        const braceMatch = jsonBlockMatch[1].match(/{[\s\S]*}/);
        if (braceMatch) {
          try {
            return JSON.parse(braceMatch[0]);
          } catch (secondError) {
            logger.warn(
              `JSON 블록 파싱 실패: text=${jsonBlockMatch[1].substring(0, 100)}, error=${secondError}`
            );
            return null;
          }
        }
        logger.warn(
          `JSON 블록 형식 오류: text=${jsonBlockMatch[1].substring(0, 100)}, error=${parseError}`
        );
        return null;
      }
    }
    
    // 2. 일반 중괄호 형태 파싱
    const braceMatch = text.match(/{[\s\S]*}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch (parseError) {
        logger.warn(
          `중괄호 JSON 파싱 실패: text=${braceMatch[0].substring(0, 100)}, error=${parseError}`
        );
        return null;
      }
    }
    
    logger.debug(
      `JSON 추출 실패 - 유효한 JSON 형식이 없음: text=${text.substring(0, 100)}`
    );
    return null;
  } catch (error) {
    logger.error('JSON 추출 중 예상치 못한 오류:', error);
    return null;
  }
}

/**
 * 안전한 JSON 파싱
 */
export function safeJsonParse(text: string, defaultValue: any = null): any {
  try {
    return JSON.parse(text);
  } catch (error) {
    logger.warn(
      `JSON 파싱 실패: text=${text.substring(0, 100)}, error=${error}`
    );
    return defaultValue;
  }
}

/**
 * 객체를 안전한 JSON 문자열로 변환
 */
export function safeJsonStringify(obj: any, defaultValue: string = ''): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    logger.warn(
      `JSON 문자열 변환 실패: obj=${JSON.stringify(obj).substring(0, 100)}, error=${error}`
    );
    return defaultValue;
  }
}