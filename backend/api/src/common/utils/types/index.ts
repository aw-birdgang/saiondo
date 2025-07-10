// 기존 타입들을 통합하여 export
export * from './nullable.type';
export * from './or-never.type';
export * from './pagination-options';
export * from './deep-partial.type';
export * from './maybe.type';

// 공통 타입 정의 추가
export interface PaginationResult<T> {
  items: T[];
  totalCount: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
