// Controller 인터페이스들
export * from '@/application/controllers/interfaces';

// 미들웨어들
export * from '@/application/controllers/middleware';

// Controller 구현체들
export { BaseController } from '@/application/controllers/BaseController';
export { ControllerFactory } from '@/application/controllers/ControllerFactory';

// 개별 Controller들
export { UserController } from '@/application/controllers/UserController';
export { ChannelController } from '@/application/controllers/ChannelController';
export { MessageController } from '@/application/controllers/MessageController';
export { NotificationController } from '@/application/controllers/NotificationController';
export { FileController } from '@/application/controllers/FileController';
export { AnalyticsController } from '@/application/controllers/AnalyticsController';

// Controller 타입 정의
export type ControllerType =
  | 'user'
  | 'channel'
  | 'message'
  | 'notification'
  | 'file'
  | 'analytics';

// Controller 생성 함수
export const createController = (type: ControllerType) => {
  const factory = ControllerFactory.getInstance();
  return factory.createController(type);
};

// 모든 Controller 초기화
export const initializeAllControllers = async () => {
  const factory = ControllerFactory.getInstance();
  await factory.initializeAllControllers();
};

// 모든 Controller 정리
export const cleanupAllControllers = async () => {
  const factory = ControllerFactory.getInstance();
  await factory.cleanupAllControllers();
};

// Controller 통계 조회
export const getControllerStats = () => {
  const factory = ControllerFactory.getInstance();
  return factory.getControllerStats();
};

// Factory 정보 조회
export const getFactoryInfo = () => {
  const factory = ControllerFactory.getInstance();
  return factory.getFactoryInfo();
};
