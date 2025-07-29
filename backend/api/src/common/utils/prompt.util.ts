import { createWinstonLogger } from '@common/logger/winston.logger';

const logger = createWinstonLogger('PromptUtil');

// 프롬프트 캐시
let promptCache: Record<string, string> | null = null;

/**
 * 프롬프트 템플릿을 파라미터로 채우는 함수
 * {{key}} 형태의 플레이스홀더를 실제 값으로 치환
 */
export function fillPromptTemplate(template: string, params: Record<string, any>): string {
  try {
    return template.replace(/{{(.*?)}}/g, (_, key) => {
      const trimmedKey = key.trim();
      const value = params[trimmedKey];

      if (value === undefined || value === null) {
        logger.warn(`프롬프트 템플릿 파라미터 누락: ${trimmedKey}`);

        return '';
      }

      if (typeof value === 'object') {
        return JSON.stringify(value);
      }

      return String(value);
    });
  } catch (error) {
    logger.error(
      `프롬프트 템플릿 채우기 실패: template=${template.substring(0, 100)}, params=${JSON.stringify(params)}, error=${error}`,
    );

    return template;
  }
}

/**
 * 프롬프트 템플릿 파일 로드
 * 캐시를 사용하여 성능 최적화
 */
export function loadPromptTemplate(key: string): string {
  try {
    if (!promptCache) {
      logger.error('프롬프트 캐시가 초기화되지 않았음');

      return '';
    }
    const template = promptCache[key];

    if (!template) {
      logger.warn(`프롬프트 템플릿을 찾을 수 없음: ${key}`);

      return '';
    }

    return template;
  } catch (error) {
    logger.error(`프롬프트 템플릿 로드 실패: key=${key}, error=${error}`);

    return '';
  }
}

/**
 * 프롬프트 캐시 초기화
 */
export function clearPromptCache(): void {
  promptCache = null;
  logger.debug('프롬프트 캐시 초기화됨');
}

/**
 * 프롬프트 템플릿 유효성 검사
 */
export function validatePromptTemplate(template: string): boolean {
  const requiredParams = template.match(/{{([^}]+)}}/g);

  if (!requiredParams) return true;

  const uniqueParams = [...new Set(requiredParams.map(p => p.slice(2, -2).trim()))];

  logger.debug(`프롬프트 템플릿 검증 완료: ${uniqueParams.length}개 파라미터 필요`);

  return true;
}
