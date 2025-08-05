import { ChannelUseCaseService } from './services/channel/ChannelUseCaseService';
import type { CreateChannelRequest, CreateChannelResponse } from '../dto/ChannelDto';

/**
 * CreateChannel UseCase - UseCase Service를 사용하여 채널 생성 로직 조율
 * 새로운 UseCase Service 구조를 활용
 */
export class CreateChannelUseCase {
  constructor(private readonly channelUseCaseService: ChannelUseCaseService) {}

  /**
   * 채널 생성 실행 - UseCase Service 사용
   */
  async execute(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    try {
      // UseCase Service를 통한 채널 생성
      const response = await this.channelUseCaseService.createChannel(request);
      
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create channel');
    }
  }

  /**
   * 채널 생성 전 검증
   */
  async validateRequest(request: CreateChannelRequest): Promise<boolean> {
    try {
      // 기본 검증
      if (!request.name || request.name.trim().length === 0) {
        throw new Error('Channel name is required');
      }

      if (request.name.length > 50) {
        throw new Error('Channel name must be at most 50 characters');
      }

      if (!request.ownerId) {
        throw new Error('Owner ID is required');
      }

      if (!request.members || request.members.length === 0) {
        throw new Error('At least one member is required');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 채널 생성 후 처리
   */
  async postCreateChannel(channelId: string, ownerId: string): Promise<void> {
    try {
      // 채널 생성 후 필요한 추가 작업들
      // 예: 알림 발송, 이벤트 로깅, 캐시 무효화 등
      
      // 채널 관련 캐시 무효화
      // this.channelUseCaseService.invalidateChannelCache(channelId);
      
      // 사용자 관련 캐시 무효화
      // this.channelUseCaseService.invalidateUserCache(ownerId);
      
    } catch (error) {
      // 후처리 실패는 로그만 남기고 예외를 던지지 않음
      console.error('Post-create channel processing failed:', error);
    }
  }
} 