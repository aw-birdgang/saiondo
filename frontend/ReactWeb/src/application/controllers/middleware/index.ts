// 미들웨어 인터페이스
export * from '../interfaces/IControllerMiddleware';

// 미들웨어 구현체들
export { MiddlewareChain } from './MiddlewareChain';
export { LoggingMiddleware } from './LoggingMiddleware';
export { PerformanceMiddleware } from './PerformanceMiddleware';
export { CachingMiddleware } from './CachingMiddleware';
export { ValidationMiddleware } from './ValidationMiddleware';

// 미들웨어 팩토리 함수
export const createDefaultMiddlewareChain = () => {
  const {
    MiddlewareChain,
    ValidationMiddleware,
    LoggingMiddleware,
    PerformanceMiddleware,
    CachingMiddleware,
  } = require('./');
  const chain = new MiddlewareChain();

  // 우선순위 순서대로 미들웨어 추가
  chain.addMiddleware(new ValidationMiddleware()); // 우선순위: 5
  chain.addMiddleware(new LoggingMiddleware()); // 우선순위: 10
  chain.addMiddleware(new PerformanceMiddleware()); // 우선순위: 20
  chain.addMiddleware(new CachingMiddleware()); // 우선순위: 30

  return chain;
};

// 미들웨어 타입 정의
export type MiddlewareType =
  | 'validation'
  | 'logging'
  | 'performance'
  | 'caching';

// 미들웨어 생성 함수
export const createMiddleware = (type: MiddlewareType) => {
  const {
    ValidationMiddleware,
    LoggingMiddleware,
    PerformanceMiddleware,
    CachingMiddleware,
  } = require('./');

  switch (type) {
    case 'validation':
      return new ValidationMiddleware();
    case 'logging':
      return new LoggingMiddleware();
    case 'performance':
      return new PerformanceMiddleware();
    case 'caching':
      return new CachingMiddleware();
    default:
      throw new Error(`Unknown middleware type: ${type}`);
  }
};
