import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { IController } from '../application/controllers/interfaces/IController';
import { ControllerFactory } from '../application/controllers/ControllerFactory';
import { Logger } from '../shared/utils/Logger';

/**
 * Controller 인스턴스들을 관리하는 인터페이스
 */
interface Controllers {
  userController: IController;
  channelController: IController;
  messageController: IController;
  notificationController: IController;
  fileController: IController;
  analyticsController: IController;
}

/**
 * Controller Context 생성
 */
const ControllerContext = createContext<Controllers | null>(null);

/**
 * Controller Provider Props
 */
interface ControllerProviderProps {
  children: ReactNode;
}

/**
 * Controller Provider - 모든 Controller 인스턴스를 제공
 */
export const ControllerProvider: React.FC<ControllerProviderProps> = ({
  children,
}) => {
  const [controllers, setControllers] = useState<Controllers | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const logger = new Logger('ControllerProvider');

  useEffect(() => {
    const initializeControllers = async () => {
      try {
        logger.info('Initializing controllers');

        const factory = ControllerFactory.getInstance();

        // 이미 초기화된 컨트롤러가 있는지 확인
        const existingControllers = factory.getAllControllers();
        if (Object.keys(existingControllers).length > 0) {
          logger.info('Controllers already exist, reusing existing instances');
          const controllerInstances: Controllers = {
            userController: factory.getController('user')!,
            channelController: factory.getController('channel')!,
            messageController: factory.getController('message')!,
            notificationController: factory.getController('notification')!,
            fileController: factory.getController('file')!,
            analyticsController: factory.getController('analytics')!,
          };
          setControllers(controllerInstances);
          setIsInitialized(true);
          return;
        }

        // Controller 인스턴스들을 생성
        const controllerInstances: Controllers = {
          userController: await factory.createController('user'),
          channelController: await factory.createController('channel'),
          messageController: await factory.createController('message'),
          notificationController: await factory.createController('notification'),
          fileController: await factory.createController('file'),
          analyticsController: await factory.createController('analytics'),
        };

        // 모든 Controller 초기화
        await factory.initializeAllControllers();

        setControllers(controllerInstances);
        setIsInitialized(true);

        logger.info('Controllers initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize controllers:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    initializeControllers();

    // Cleanup on unmount - 앱이 완전히 종료될 때만 실행
    return () => {
      // 개발 환경에서는 cleanup을 건너뛰어 중복 초기화 방지
      if (process.env.NODE_ENV === 'production') {
        const factory = ControllerFactory.getInstance();
        factory.cleanupAllControllers();
      }
    };
  }, []);

  if (!isInitialized || !controllers) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Initializing Controllers...</p>
        </div>
      </div>
    );
  }

  return (
    <ControllerContext.Provider value={controllers}>
      {children}
    </ControllerContext.Provider>
  );
};

/**
 * Controller Hook - 컴포넌트에서 Controller에 접근하기 위한 Hook
 */
export const useControllers = (): Controllers => {
  const context = useContext(ControllerContext);

  if (!context) {
    throw new Error('useControllers must be used within a ControllerProvider');
  }

  return context;
};

/**
 * 개별 Controller Hook들 - 특정 Controller만 필요한 경우 사용
 */
export const useUserController = (): IController => {
  const { userController } = useControllers();
  return userController;
};

export const useChannelController = (): IController => {
  const { channelController } = useControllers();
  return channelController;
};

export const useMessageController = (): IController => {
  const { messageController } = useControllers();
  return messageController;
};

export const useNotificationController = (): IController => {
  const { notificationController } = useControllers();
  return notificationController;
};

export const useFileController = (): IController => {
  const { fileController } = useControllers();
  return fileController;
};

export const useAnalyticsController = (): IController => {
  const { analyticsController } = useControllers();
  return analyticsController;
};

/**
 * Controller 상태 모니터링 Hook
 */
export const useControllerStats = () => {
  const controllers = useControllers();

  const stats = {
    userController: controllers.userController.getControllerInfo(),
    channelController: controllers.channelController.getControllerInfo(),
    messageController: controllers.messageController.getControllerInfo(),
    notificationController:
      controllers.notificationController.getControllerInfo(),
    fileController: controllers.fileController.getControllerInfo(),
    analyticsController: controllers.analyticsController.getControllerInfo(),
  };

  return stats;
};
