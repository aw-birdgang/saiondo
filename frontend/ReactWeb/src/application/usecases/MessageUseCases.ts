import type { MessageService } from '../services/MessageService';
import { MessageUseCaseService } from './services/message/MessageUseCaseService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  CreateMessageRequest,
  CreateMessageResponse,
  DeleteMessageRequest,
  DeleteMessageResponse,
  GetMessageRequest,
  GetMessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  UpdateMessageRequest,
  UpdateMessageResponse,
  SendMessageRequest,
  SendMessageResponse,
  GetChannelMessagesRequest,
  GetChannelMessagesResponse,
  GetUserMessagesRequest,
  GetUserMessagesResponse,
  GetMessageStatsRequest,
  GetMessageStatsResponse
} from '../dto/MessageDto';

/**
 * MessageUseCases - MessageUseCaseService를 사용하여 메시지 관련 애플리케이션 로직 조율
 * 새로운 UseCase Service 구조를 활용
 */
export class MessageUseCases {
  constructor(private readonly messageUseCaseService: MessageUseCaseService) {}

  /**
   * 메시지 생성
   */
  async createMessage(request: CreateMessageRequest): Promise<CreateMessageResponse> {
    const sendRequest: SendMessageRequest = {
      content: request.content,
      channelId: request.channelId,
      senderId: request.senderId,
      type: request.type,
      metadata: request.metadata,
      replyTo: request.replyTo
    };

    const response = await this.messageUseCaseService.sendMessage(sendRequest);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create message');
    }
    
    return { message: response.message };
  }

  /**
   * 메시지 조회
   */
  async getMessage(request: GetMessageRequest): Promise<GetMessageResponse> {
    const useCaseRequest: GetMessageRequest = {
      id: request.id,
      messageId: request.id
    };

    const response = await this.messageUseCaseService.getMessage(useCaseRequest);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get message');
    }
    
    return {
      message: response.message,
      success: response.success,
      cached: response.cached,
      fetchedAt: response.fetchedAt
    };
  }

  /**
   * 메시지 목록 조회
   */
  async getMessages(request: GetMessagesRequest): Promise<GetMessagesResponse> {
    const useCaseRequest: GetChannelMessagesRequest = {
      channelId: request.channelId,
      limit: request.limit,
      offset: request.offset
    };

    const response = await this.messageUseCaseService.getChannelMessages(useCaseRequest);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get messages');
    }
    
    return {
      messages: response.messages,
      total: response.total,
      hasMore: response.hasMore
    };
  }

  /**
   * 메시지 업데이트
   */
  async updateMessage(request: UpdateMessageRequest): Promise<UpdateMessageResponse> {
    const useCaseRequest = {
      messageId: request.id,
      updates: { content: request.content },
      userId: request.userId
    };

    const response = await this.messageUseCaseService.updateMessage(useCaseRequest);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update message');
    }
    
    return { message: response.message };
  }

  /**
   * 메시지 삭제
   */
  async deleteMessage(request: DeleteMessageRequest): Promise<DeleteMessageResponse> {
    const useCaseRequest = {
      messageId: request.id,
      userId: request.userId
    };

    const response = await this.messageUseCaseService.deleteMessage(useCaseRequest);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete message');
    }
    
    return { success: response.success };
  }

  /**
   * 최근 메시지 조회
   */
  async getRecentMessages(channelId: string, limit: number): Promise<GetMessagesResponse> {
    const useCaseRequest: GetChannelMessagesRequest = {
      channelId,
      limit,
      offset: 0
    };

    const response = await this.messageUseCaseService.getChannelMessages(useCaseRequest);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get recent messages');
    }
    
    return {
      messages: response.messages,
      total: response.total,
      hasMore: response.hasMore
    };
  }

  /**
   * 메시지 검색
   */
  async searchMessages(query: string, channelId?: string, userId?: string, limit: number = 20): Promise<GetMessagesResponse> {
    const useCaseRequest = {
      query,
      channelId,
      userId,
      limit
    };

    const response = await this.messageUseCaseService.searchMessages(useCaseRequest);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to search messages');
    }
    
    return {
      messages: response.messages,
      total: response.total,
      hasMore: response.total > limit
    };
  }

  /**
   * 사용자 메시지 조회 (새로운 메서드)
   */
  async getUserMessages(request: GetUserMessagesRequest): Promise<GetUserMessagesResponse> {
    const response = await this.messageUseCaseService.getUserMessages(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get user messages');
    }
    
    return response;
  }

  /**
   * 메시지 통계 조회 (새로운 메서드)
   */
  async getMessageStats(request: GetMessageStatsRequest): Promise<GetMessageStatsResponse> {
    const response = await this.messageUseCaseService.getMessageStats(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get message stats');
    }
    
    return response;
  }

  /**
   * 메시지 존재 확인 (새로운 메서드)
   */
  async messageExists(messageId: string): Promise<boolean> {
    return await this.messageUseCaseService.messageExists(messageId);
  }

  /**
   * 메시지 캐시 통계 조회 (새로운 메서드)
   */
  async getMessageCacheStats(): Promise<any> {
    return await this.messageUseCaseService.getMessageCacheStats();
  }

  /**
   * 메시지 개수 조회
   */
  async getMessageCount(channelId: string): Promise<number> {
    const statsRequest: GetMessageStatsRequest = { channelId };
    const stats = await this.getMessageStats(statsRequest);
    
    if (!stats.success || !stats.stats) {
      return 0;
    }
    
    return stats.stats.totalMessages;
  }
}
