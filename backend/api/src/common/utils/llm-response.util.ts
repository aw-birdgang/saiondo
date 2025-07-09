// backend/api/src/common/utils/llm-response.util.ts
export class LLMResponseUtil {
  /**
   * LLM 응답을 안전하게 JSON으로 파싱
   */
  static parseResponse(response: any): any {
    try {
      if (typeof response === 'string') {
        return JSON.parse(response);
      } else if (response && typeof response.response === 'string') {
        return JSON.parse(response.response);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('JSON 파싱 실패:', error);
      return {};
    }
  }

  /**
   * LLM 응답에서 특정 필드를 안전하게 추출
   */
  static getField(response: any, field: string, defaultValue: any = null): any {
    const parsed = this.parseResponse(response);
    return parsed[field] ?? defaultValue;
  }

  /**
   * LLM 응답에서 여러 필드를 한 번에 추출
   */
  static getFields(response: any, fields: Record<string, any>): Record<string, any> {
    const parsed = this.parseResponse(response);
    const result: Record<string, any> = {};
    
    for (const [field, defaultValue] of Object.entries(fields)) {
      result[field] = parsed[field] ?? defaultValue;
    }
    
    return result;
  }
}
