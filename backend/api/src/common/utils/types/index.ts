export * from './nullable.type';
export * from './or-never.type';
export * from './deep-partial.type';
export * from './maybe.type';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
