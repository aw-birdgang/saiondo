// 기본 타입 정의
export type NullableType<T> = T | null;
export type MaybeType<T> = T | undefined;
export type OrNeverType<T> = T | never;

// 깊은 부분 타입
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// 페이지네이션 관련 타입
export interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  items: T[];
  totalCount: number;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// LLM 메시지 타입
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
