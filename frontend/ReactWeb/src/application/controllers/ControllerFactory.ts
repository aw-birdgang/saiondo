import type { ControllerMetadata, IController } from '@/application/controllers/interfaces/IController';
import { UserController } from '@/application/controllers/UserController';
import { ChannelController } from '@/application/controllers/ChannelController';
import { MessageController } from '@/application/controllers/MessageController';
import { NotificationController } from '@/application/controllers/NotificationController';
import { FileController } from '@/application/controllers/FileController';
import { AnalyticsController } from '@/application/controllers/AnalyticsController';
import { Logger } from '@/shared/utils/Logger';
import { UseCaseFactory } from '@/application/usecases/UseCaseFactory';

/**
 * Controller Factory - Controller 인스턴스 생성 및 관리
 */
export class ControllerFactory {
  private static instance: ControllerFactory;
  private controllers: Map<string, IController> = new Map();
  private readonly logger = new Logger('ControllerFactory');
  private isInitialized = false;

  private constructor() {}

  /**
   * 싱글톤 인스턴스 반환
   */
  static getInstance(): ControllerFactory {
    if (!ControllerFactory.instance) {
      ControllerFactory.instance = new ControllerFactory();
    }
    return ControllerFactory.instance;
  }

  /**
   * Factory 초기화
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // UseCase 레지스트리 초기화
      await UseCaseFactory.initialize();
      this.isInitialized = true;
      this.logger.info('ControllerFactory initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize ControllerFactory:', error);
      throw error;
    }
  }

  /**
   * Controller 생성
   */
  async createController(type: string): Promise<IController> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.controllers.has(type)) {
      return this.controllers.get(type)!;
    }

    let controller: IController;

    switch (type.toLowerCase()) {
      case 'user':
        controller = new UserController();
        break;
      case 'channel':
        controller = new ChannelController();
        break;
      case 'message':
        controller = new MessageController();
        break;
      case 'notification':
        controller = new NotificationController();
        break;
      case 'file':
        controller = new FileController();
        break;
      case 'analytics':
        controller = new AnalyticsController();
        break;
      default:
        throw new Error(`Unknown controller type: ${type}`);
    }

    this.controllers.set(type, controller);
    this.logger.info(`Controller created: ${type}`);

    return controller;
  }

  /**
   * Controller 조회
   */
  getController(type: string): IController | null {
    return this.controllers.get(type) || null;
  }

  /**
   * 모든 Controller 조회
   */
  getAllControllers(): Map<string, IController> {
    return new Map(this.controllers);
  }

  /**
   * Controller 제거
   */
  removeController(type: string): boolean {
    const controller = this.controllers.get(type);
    if (controller) {
      controller.cleanup();
      this.controllers.delete(type);
      this.logger.info(`Controller removed: ${type}`);
      return true;
    }
    return false;
  }

  /**
   * 모든 Controller 초기화
   */
  async initializeAllControllers(): Promise<void> {
    this.logger.info('Initializing all controllers');

    const initPromises = Array.from(this.controllers.values()).map(controller =>
      controller.initialize()
    );

    await Promise.all(initPromises);
    this.logger.info('All controllers initialized');
  }

  /**
   * 모든 Controller 정리
   */
  async cleanupAllControllers(): Promise<void> {
    this.logger.info('Cleaning up all controllers');

    const cleanupPromises = Array.from(this.controllers.values()).map(
      controller => controller.cleanup()
    );

    await Promise.all(cleanupPromises);
    this.controllers.clear();
    this.logger.info('All controllers cleaned up');
  }

  /**
   * Controller 메타데이터 조회
   */
  getControllerMetadata(type: string): ControllerMetadata | null {
    const controller = this.getController(type);
    if (!controller) return null;

    return {
      name: controller.name,
      version: '1.0.0',
      description: `${controller.name} controller`,
      dependencies: [],
      capabilities: ['execute', 'track', 'monitor'],
    };
  }

  /**
   * Controller 상태 정보 조회
   */
  getControllerStats(): Record<string, any> {
    const stats: Record<string, any> = {};

    for (const [type, controller] of this.controllers.entries()) {
      stats[type] = {
        info: controller.getControllerInfo(),
        metrics: controller.getMetrics(),
        isActive: controller.isActive(),
      };
    }

    return stats;
  }

  /**
   * Factory 상태 정보
   */
  getFactoryInfo() {
    return {
      totalControllers: this.controllers.size,
      activeControllers: Array.from(this.controllers.values()).filter(c =>
        c.isActive()
      ).length,
      controllerTypes: Array.from(this.controllers.keys()),
    };
  }
}
