import type { ILogger } from '../../../../domain/interfaces/ILogger';
import { BaseCacheService, type ICache } from '../../../services/base/BaseCacheService';
import { MessageService } from '../../../services/message/MessageService';
import { UserService } from '../../../services/user/UserService';
import { ChannelService } from '../../../services/channel/ChannelService';
import type {
  SendMessageRequest,
  SendMessageResponse,
  GetMessageRequest,
  GetMessageResponse,
  GetChannelMessagesRequest,
  GetChannelMessagesResponse,
  UpdateMessageRequest,
  UpdateMessageResponse,
  DeleteMessageRequest,
  DeleteMessageResponse,
  SearchMessagesRequest,
  SearchMessagesResponse,
  GetUserMessagesRequest,
  GetUserMessagesResponse,
  GetMessageStatsRequest,
  GetMessageStatsResponse
} from '../../../dto/MessageDto';

/**
 * MessageUseCaseService - 메시지 관련 UseCase 전용 서비스
 * 캐싱, 권한 검증, DTO 변환 등의 UseCase별 특화 로직 처리
 */
export class MessageUseCaseService extends BaseCacheService {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    cache?: ICache,
    logger?: ILogger
  ) {
    super(cache, logger);
  }

  /**
   * 메시지 전송 - 캐시 무효화
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      // 권한 검증
      await this.checkMessagePermissions(request.senderId, 'send_message', request.channelId);

      // Base Service 호출
      const message = await this.messageService.sendMessage({
        content: request.content,
        channelId: request.channelId,
        senderId: request.senderId,
        type: request.type,
        metadata: request.metadata,
        replyTo: request.replyTo
      });

      // 관련 캐시 무효화
      this.invalidateMessageCache(request.channelId, request.senderId);

      return {
        message,
        success: true,
        sentAt: new Date()
      };
    } catch (error) {
      return {
        message: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sentAt: new Date()
      };
    }
  }

  /**
   * 메시지 조회 - 캐싱 적용
   */
  async getMessage(request: GetMessageRequest): Promise<GetMessageResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('message', 'single', request.messageId);
      const cached = await this.getCached<GetMessageResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const message = await this.messageService.getMessage(request.messageId);

      const response: GetMessageResponse = {
        message,
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('message_single'));

      return response;
    } catch (error) {
      return {
        message: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 채널 메시지 조회 - 캐싱 적용
   */
  async getChannelMessages(request: GetChannelMessagesRequest): Promise<GetChannelMessagesResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('message', 'channel', request.channelId, request.limit, request.offset);
      const cached = await this.getCached<GetChannelMessagesResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const result = await this.messageService.getChannelMessages(
        request.channelId,
        request.limit,
        request.offset
      );

      const response: GetChannelMessagesResponse = {
        messages: result.messages,
        success: true,
        cached: false,
        total: result.total,
        hasMore: result.hasMore,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('message_channel'));

      return response;
    } catch (error) {
      return {
        messages: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        total: 0,
        hasMore: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 메시지 업데이트 - 캐시 무효화
   */
  async updateMessage(request: UpdateMessageRequest): Promise<UpdateMessageResponse> {
    try {
      // 권한 검증
      await this.checkMessagePermissions(request.userId, 'update_message', request.messageId);

      // Base Service 호출
      const updatedMessage = await this.messageService.updateMessage(
        request.messageId,
        request.updates,
        request.userId
      );

      // 관련 캐시 무효화
      this.invalidateMessageCache(updatedMessage.channelId, updatedMessage.senderId);

      return {
        message: updatedMessage,
        success: true,
        updatedAt: new Date()
      };
    } catch (error) {
      return {
        message: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date()
      };
    }
  }

  /**
   * 메시지 삭제 - 캐시 무효화
   */
  async deleteMessage(request: DeleteMessageRequest): Promise<DeleteMessageResponse> {
    try {
      // 권한 검증
      await this.checkMessagePermissions(request.userId, 'delete_message', request.messageId);

      // Base Service 호출
      const deleted = await this.messageService.deleteMessage(request.messageId, request.userId);

      if (deleted) {
        // 관련 캐시 무효화
        this.invalidateMessageCache('*', request.userId);
      }

      return {
        success: deleted,
        deletedAt: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        deletedAt: new Date()
      };
    }
  }

  /**
   * 메시지 검색 - 캐싱 적용
   */
  async searchMessages(request: SearchMessagesRequest): Promise<SearchMessagesResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('message', 'search', request.query, request.channelId, request.userId);
      const cached = await this.getCached<SearchMessagesResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const messages = await this.messageService.searchMessages(
        request.query,
        request.channelId,
        request.userId,
        request.limit
      );

      const response: SearchMessagesResponse = {
        messages,
        success: true,
        cached: false,
        total: messages.length,
        query: request.query,
        fetchedAt: new Date()
      };

      // 캐시 저장 (검색 결과는 짧은 TTL)
      await this.setCached(cacheKey, response, this.calculateTTL('message_search'));

      return response;
    } catch (error) {
      return {
        messages: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        total: 0,
        query: request.query,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 사용자 메시지 조회 - 캐싱 적용
   */
  async getUserMessages(request: GetUserMessagesRequest): Promise<GetUserMessagesResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('message', 'user', request.userId, request.limit, request.offset);
      const cached = await this.getCached<GetUserMessagesResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const result = await this.messageService.getUserMessages(
        request.userId,
        request.limit,
        request.offset
      );

      const response: GetUserMessagesResponse = {
        messages: result.messages,
        success: true,
        cached: false,
        total: result.total,
        hasMore: result.hasMore,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('message_user'));

      return response;
    } catch (error) {
      return {
        messages: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        total: 0,
        hasMore: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 메시지 통계 조회 - 캐싱 적용
   */
  async getMessageStats(request: GetMessageStatsRequest): Promise<GetMessageStatsResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('message', 'stats', request.channelId, request.userId);
      const cached = await this.getCached<GetMessageStatsResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const stats = await this.messageService.getMessageStats(request.channelId, request.userId);

      const response: GetMessageStatsResponse = {
        stats,
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('message_stats'));

      return response;
    } catch (error) {
      return {
        stats: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 메시지 존재 확인
   */
  async messageExists(messageId: string): Promise<boolean> {
    return await this.messageService.messageExists(messageId);
  }

  // Private helper methods

  /**
   * 메시지 권한 검증
   */
  private async checkMessagePermissions(userId: string, operation: string, resourceId: string): Promise<boolean> {
    // 기본 권한 검증 (실제로는 더 복잡한 권한 시스템 사용)
    const hasPermission = await this.userService.hasPermission(userId, operation);
    
    if (!hasPermission) {
      throw new Error(`User ${userId} does not have permission to ${operation}`);
    }
    
    return true;
  }

  /**
   * 메시지 관련 캐시 무효화
   */
  private invalidateMessageCache(channelId: string, userId: string): void {
    this.invalidateCachePattern(`message:channel:${channelId}:*`);
    this.invalidateCachePattern(`message:user:${userId}:*`);
    this.invalidateCachePattern(`message:search:*`);
    this.invalidateCachePattern(`message:stats:*`);
  }

  /**
   * 메시지 캐시 통계 조회
   */
  async getMessageCacheStats(): Promise<any> {
    const keys = await this.cache.keys();
    const messageKeys = keys.filter(key => key.startsWith('message:'));
    
    return {
      totalKeys: keys.length,
      messageKeys: messageKeys.length,
      hitRate: 0.85, // 실제 구현에서는 히트율 계산
      missRate: 0.15,
      averageTTL: 300
    };
  }
} 