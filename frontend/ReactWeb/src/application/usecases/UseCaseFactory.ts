import { UserUseCase } from '@/application/usecases/UserUseCase';
import { ChannelUseCase } from '@/application/usecases/ChannelUseCase';
import { MessageUseCase } from '@/application/usecases/MessageUseCase';
import { FileUseCase } from '@/application/usecases/FileUseCase';
import { SystemUseCase } from '@/application/usecases/SystemUseCase';

/**
 * UseCaseFactory - 통합된 Use Case들을 생성하는 팩토리 클래스
 * 21개의 개별 Use Case를 5개의 통합 Use Case로 단순화
 */
export class UseCaseFactory {
  private static isInitialized = false;

  /**
   * Factory 초기화
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // UseCase 레지스트리 초기화 로직
      this.isInitialized = true;
      console.log('UseCaseFactory initialized successfully');
    } catch (error) {
      console.error('Failed to initialize UseCaseFactory:', error);
      throw error;
    }
  }

  // ==================== 개별 Use Case 생성 ====================

  /**
   * UserUseCase 생성
   */
  static createUserUseCase(userRepository: any): UserUseCase {
    return new UserUseCase(userRepository);
  }

  /**
   * ChannelUseCase 생성
   */
  static createChannelUseCase(channelRepository: any): ChannelUseCase {
    return new ChannelUseCase(channelRepository);
  }

  /**
   * MessageUseCase 생성
   */
  static createMessageUseCase(messageRepository: any): MessageUseCase {
    return new MessageUseCase(messageRepository);
  }

  /**
   * FileUseCase 생성
   */
  static createFileUseCase(fileRepository: any): FileUseCase {
    return new FileUseCase(fileRepository);
  }

  /**
   * SystemUseCase 생성
   */
  static createSystemUseCase(apiClient: any, cacheService: any): SystemUseCase {
    return new SystemUseCase(apiClient, cacheService);
  }

  // ==================== 모든 Use Case 생성 ====================

  /**
   * 모든 Use Case 생성
   */
  static createAllUseCases(dependencies: {
    userRepository: any;
    channelRepository: any;
    messageRepository: any;
    fileRepository: any;
    apiClient: any;
    cacheService: any;
  }) {
    return {
      user: this.createUserUseCase(dependencies.userRepository),
      channel: this.createChannelUseCase(dependencies.channelRepository),
      message: this.createMessageUseCase(dependencies.messageRepository),
      file: this.createFileUseCase(dependencies.fileRepository),
      system: this.createSystemUseCase(dependencies.apiClient, dependencies.cacheService),
    };
  }

  // ==================== Use Case 그룹 생성 ====================

  /**
   * 인증 관련 Use Case 그룹 생성
   */
  static createAuthUseCases(userRepository: any) {
    return {
      user: this.createUserUseCase(userRepository),
    };
  }

  /**
   * 채널 관련 Use Case 그룹 생성
   */
  static createChannelUseCases(channelRepository: any) {
    return {
      channel: this.createChannelUseCase(channelRepository),
    };
  }

  /**
   * 메시지 관련 Use Case 그룹 생성
   */
  static createMessageUseCases(messageRepository: any) {
    return {
      message: this.createMessageUseCase(messageRepository),
    };
  }

  /**
   * 파일 관련 Use Case 그룹 생성
   */
  static createFileUseCases(fileRepository: any) {
    return {
      file: this.createFileUseCase(fileRepository),
    };
  }

  /**
   * 시스템 관련 Use Case 그룹 생성
   */
  static createSystemUseCases(apiClient: any, cacheService: any) {
    return {
      system: this.createSystemUseCase(apiClient, cacheService),
    };
  }

  // ==================== 유틸리티 메서드 ====================

  /**
   * 등록된 Use Case 목록 조회
   */
  static getRegisteredUseCases(): string[] {
    return [
      'UserUseCase',
      'ChannelUseCase', 
      'MessageUseCase',
      'FileUseCase',
      'SystemUseCase',
    ];
  }

  /**
   * Use Case 메타데이터 조회
   */
  static getUseCaseMetadata(useCaseName: string) {
    const metadata = {
      UserUseCase: {
        description: '사용자 관련 모든 기능 (인증, 관리, 권한)',
        methods: [
          'authenticate', 'register', 'logout',
          'getCurrentUser', 'updateUser', 'getUser',
          'searchUsers', 'checkUserPermission'
        ],
        dependencies: ['userRepository']
      },
      ChannelUseCase: {
        description: '채널 관련 모든 기능 (생성, 관리, 멤버)',
        methods: [
          'createChannel', 'getChannel', 'updateChannel',
          'addMember', 'removeMember', 'inviteToChannel',
          'searchChannels'
        ],
        dependencies: ['channelRepository']
      },
      MessageUseCase: {
        description: '메시지 관련 모든 기능 (전송, 조회, 검색)',
        methods: [
          'sendMessage', 'getMessage', 'getMessages',
          'updateMessage', 'deleteMessage', 'searchMessages',
          'connectToRealTimeChat'
        ],
        dependencies: ['messageRepository']
      },
      FileUseCase: {
        description: '파일 관련 모든 기능 (업로드, 다운로드, 관리)',
        methods: [
          'uploadFile', 'downloadFile', 'getFileInfo',
          'deleteFile', 'searchFiles', 'processFilePayment'
        ],
        dependencies: ['fileRepository']
      },
      SystemUseCase: {
        description: '시스템 관련 모든 기능 (분석, 모니터링, 캐시)',
        methods: [
          'getAnalytics', 'startAPMMonitoring', 'getFromCache',
          'processPayment', 'globalSearch', 'getSystemStatus'
        ],
        dependencies: ['apiClient', 'cacheService']
      }
    };

    return metadata[useCaseName as keyof typeof metadata] || null;
  }
}

