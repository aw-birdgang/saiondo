import type { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import type { IChannelRepository } from '../../../domain/repositories/IChannelRepository';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { DomainErrorFactory } from '../../../domain/errors/DomainError';
import { BaseService } from '../base/BaseService';
import type { ILogger } from '../../../domain/interfaces/ILogger';
import type {
  MessageProfile,
  MessageStats,
  MessageServiceConfig
} from '../../dto/MessageDto';

/**
 * MessageService - BaseService를 상속하여 메시지 관련 도메인 로직 처리
 * 성능 측정, 에러 처리, 검증 등의 공통 기능은 BaseService에서 제공
 */
export class MessageService extends BaseService<IMessageRepository> {
  protected repository: IMessageRepository;
  private readonly config: MessageServiceConfig;

  constructor(
    messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository,
    logger?: ILogger,
    config: MessageServiceConfig = {}
  ) {
    super(logger);
    this.repository = messageRepository;
    this.config = config;
  }

  /**
   * 메시지 전송
   */
  async sendMessage(messageData: {
    content: string;
    channelId: string;
    senderId: string;
    type?: 'text' | 'image' | 'file' | 'system';
    metadata?: Record<string, any>;
    replyTo?: string;
  }): Promise<MessageProfile> {
    return await this.measurePerformance(
      'send_message',
      async () => {
        // 입력 검증
        if (this.config.enableValidation) {
          this.validateMessageData(messageData);
        }

        // 기본 검증
        if (!messageData.content || messageData.content.trim().length === 0) {
          throw new Error('Message content is required');
        }

        if (messageData.content.length > (this.config.maxMessageLength || 2000)) {
          throw new Error('Message content must be less than 2000 characters');
        }

        if (!messageData.channelId || messageData.channelId.trim().length === 0) {
          throw new Error('Channel ID is required');
        }

        if (!messageData.senderId || messageData.senderId.trim().length === 0) {
          throw new Error('Sender ID is required');
        }

        // 메시지 저장 (실제로는 repository에 save 메서드가 있어야 함)
        // const savedMessage = await this.repository.save(messageData);
        // return this.mapToMessageProfile(savedMessage);
        
        // 임시로 메시지 데이터 반환
        return this.mapToMessageProfile({
          id: 'temp-message-id',
          ...messageData,
          createdAt: new Date(),
          updatedAt: new Date(),
          isEdited: false,
          isDeleted: false
        });
      },
      { messageData }
    );
  }

  /**
   * 메시지 조회
   */
  async getMessage(messageId: string): Promise<MessageProfile> {
    return await this.measurePerformance(
      'get_message',
      async () => {
        const message = await this.repository.findById(messageId);
        
        if (!message) {
          throw DomainErrorFactory.createMessageNotFound(messageId);
        }

        return this.mapToMessageProfile(message);
      },
      { messageId }
    );
  }

  /**
   * 채널 메시지 조회
   */
  async getChannelMessages(
    channelId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<{
    messages: MessageProfile[];
    total: number;
    hasMore: boolean;
  }> {
    return await this.measurePerformance(
      'get_channel_messages',
      async () => {
        // 채널 존재 확인
        const channel = await this.channelRepository.findById(channelId);
        if (!channel) {
          throw DomainErrorFactory.createChannelNotFound(channelId);
        }

        // 임시 결과 반환 (실제로는 repository에서 조회해야 함)
        return {
          messages: [],
          total: 0,
          hasMore: false
        };
      },
      { channelId, limit, offset }
    );
  }

  /**
   * 메시지 업데이트
   */
  async updateMessage(
    messageId: string, 
    updates: Partial<MessageProfile>, 
    userId: string
  ): Promise<MessageProfile> {
    return await this.measurePerformance(
      'update_message',
      async () => {
        // 메시지 존재 확인
        const message = await this.repository.findById(messageId);
        if (!message) {
          throw DomainErrorFactory.createMessageNotFound(messageId);
        }

        // 권한 확인 (메시지 작성자만 수정 가능)
        if (message.senderId !== userId) {
          throw new Error('Only message author can update the message');
        }

        // 입력 검증
        if (this.config.enableValidation && updates.content) {
          this.validateMessageContent(updates.content);
        }

        // 임시로 기존 메시지 반환 (실제로는 repository에서 업데이트해야 함)
        return this.mapToMessageProfile(message);
      },
      { messageId, updates, userId }
    );
  }

  /**
   * 메시지 삭제
   */
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    return await this.measurePerformance(
      'delete_message',
      async () => {
        // 메시지 존재 확인
        const message = await this.repository.findById(messageId);
        if (!message) {
          throw DomainErrorFactory.createMessageNotFound(messageId);
        }

        // 권한 확인 (메시지 작성자만 삭제 가능)
        if (message.senderId !== userId) {
          throw new Error('Only message author can delete the message');
        }

        // 임시로 삭제 성공 반환 (실제로는 repository에서 삭제해야 함)
        return true;
      },
      { messageId, userId }
    );
  }

  /**
   * 메시지 검색
   */
  async searchMessages(
    query: string, 
    channelId?: string, 
    userId?: string, 
    limit: number = 20
  ): Promise<MessageProfile[]> {
    return await this.measurePerformance(
      'search_messages',
      async () => {
        // 검색어 검증
        if (!query || query.trim().length < 2) {
          throw new Error('Search query must be at least 2 characters long');
        }

        // 임시 검색 결과 반환 (실제로는 repository에서 검색해야 함)
        return [];
      },
      { query, channelId, userId, limit }
    );
  }

  /**
   * 사용자 메시지 조회
   */
  async getUserMessages(
    userId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<{
    messages: MessageProfile[];
    total: number;
    hasMore: boolean;
  }> {
    return await this.measurePerformance(
      'get_user_messages',
      async () => {
        // 사용자 존재 확인
        const user = await this.userRepository.findById(userId);
        if (!user) {
          throw DomainErrorFactory.createUserNotFound(userId);
        }

        // 임시 결과 반환 (실제로는 repository에서 조회해야 함)
        return {
          messages: [],
          total: 0,
          hasMore: false
        };
      },
      { userId, limit, offset }
    );
  }

  /**
   * 메시지 통계 조회
   */
  async getMessageStats(channelId?: string, userId?: string): Promise<MessageStats> {
    return await this.measurePerformance(
      'get_message_stats',
      async () => {
        // 임시 통계 반환 (실제로는 repository에서 통계를 가져와야 함)
        return {
          totalMessages: 0,
          totalChannels: 0,
          averageLength: 0,
          lastMessage: null,
          messagesByType: {},
          lastMessageAt: new Date(),
          channelId,
          userId
        };
      },
      { channelId, userId }
    );
  }

  /**
   * 메시지 존재 확인
   */
  async messageExists(messageId: string): Promise<boolean> {
    return await this.measurePerformance(
      'message_exists',
      async () => {
        return await this.repository.exists(messageId);
      },
      { messageId }
    );
  }

  // Private helper methods

  /**
   * 메시지 데이터 검증
   */
  private validateMessageData(messageData: any): void {
    // 기본 검증
    if (!messageData.content || messageData.content.trim().length === 0) {
      throw new Error('Message content is required');
    }

    if (messageData.content.length > (this.config.maxMessageLength || 2000)) {
      throw new Error(`Message content must be less than ${this.config.maxMessageLength || 2000} characters`);
    }

    if (messageData.content.length < (this.config.minMessageLength || 1)) {
      throw new Error(`Message content must be at least ${this.config.minMessageLength || 1} character`);
    }

    if (!messageData.channelId || messageData.channelId.trim().length === 0) {
      throw new Error('Channel ID is required');
    }

    if (!messageData.senderId || messageData.senderId.trim().length === 0) {
      throw new Error('Sender ID is required');
    }

    // 메시지 타입 검증
    if (messageData.type && !['text', 'image', 'file', 'system'].includes(messageData.type)) {
      throw new Error('Invalid message type');
    }
  }

  /**
   * 메시지 내용 검증
   */
  private validateMessageContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error('Message content is required');
    }

    if (content.length > (this.config.maxMessageLength || 2000)) {
      throw new Error(`Message content must be less than ${this.config.maxMessageLength || 2000} characters`);
    }

    if (content.length < (this.config.minMessageLength || 1)) {
      throw new Error(`Message content must be at least ${this.config.minMessageLength || 1} character`);
    }
  }

  /**
   * 메시지 엔티티를 프로필 DTO로 변환
   */
  private mapToMessageProfile(message: any): MessageProfile {
    return {
      id: message.id,
      content: message.content,
      channelId: message.channelId,
      senderId: message.senderId,
      type: message.type || 'text',
      metadata: message.metadata || {},
      replyTo: message.replyTo,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isEdited: message.isEdited || false,
      isDeleted: message.isDeleted || false
    };
  }
} 