// Controller 인터페이스들
export * from './interfaces';

// 미들웨어들
export * from './middleware';

// Controller 구현체들
export { BaseController } from './BaseController';
export { ControllerFactory } from './ControllerFactory';

// 개별 Controller들
export { UserController } from './UserController';
export { ChannelController } from './ChannelController';
export { MessageController } from './MessageController';
export { NotificationController } from './NotificationController';
export { FileController } from './FileController';
export { AnalyticsController } from './AnalyticsController';

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
