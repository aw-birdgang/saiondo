// 예시: 에러 로깅 유틸
export function logError(error: unknown, context: string = ''): void {
  console.error(`[${context}]`, error);
} 