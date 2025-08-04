import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { MessageEntity } from '../../domain/entities/Message';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import { PerformanceMonitoringService } from './PerformanceMonitoringService';
import { ErrorHandlingService } from './ErrorHandlingService';
import { SecurityService } from './SecurityService';
import type {
  MessageProfile,
  MessageStats,
  MessageValidationSchema,
  MessageServiceConfig
} from '../dto/MessageDto';

export class MessageService {
  private readonly performanceService: PerformanceMonitoringService;
  private readonly errorService: ErrorHandlingService;
  private readonly securityService: SecurityService;

  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository,
    private readonly config: MessageServiceConfig = {}
  ) {
    this.performanceService = new PerformanceMonitoringService(
      userRepository,
      channelRepository,
      messageRepository
    );
    
    this.errorService = new ErrorHandlingService({
      enableConsoleLogging: true,
      enableRemoteLogging: false,
    });
    
    this.securityService = new SecurityService({
      enableInputValidation: config.enableValidation ?? true,
      enableXSSProtection: true,
    });
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
    return await this.performanceService.measurePerformance(
      'send_message',
      async () => {
        try {
          // 입력 검증
          if (this.config.enableValidation) {
            const validationSchema: MessageValidationSchema = {
              content: { 
                required: true, 
                type: 'string', 
                minLength: this.config.minMessageLength || 1, 
                maxLength: this.config.maxMessageLength || 2000
              },
              channelId: { 
                required: true, 
                type: 'string'
              },
              senderId: { 
                required: true, 
                type: 'string'
              },
              type: { 
                required: false, 
                type: 'string', 
                enum: ['text', 'image', 'file', 'system']
              }
            };

            const validation = this.securityService.validateInput(messageData, validationSchema);
            if (!validation.isValid) {
              throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }
          }

          // 비즈니스 규칙 검증
          if (!messageData.content || messageData.content.trim().length === 0) {
            throw DomainErrorFactory.createMessageValidation('Message content is required');
          }

          if (messageData.content.length > (this.config.maxMessageLength || 2000)) {
            throw DomainErrorFactory.createMessageValidation('Message content must be less than 2000 characters');
          }

          if (!messageData.channelId || messageData.channelId.trim().length === 0) {
            throw DomainErrorFactory.createMessageValidation('Channel ID is required');
          }

          if (!messageData.senderId || messageData.senderId.trim().length === 0) {
            throw DomainErrorFactory.createMessageValidation('Sender ID is required');
          }

          // 채널 멤버 확인
          const isMember = await this.channelRepository.isMember(messageData.channelId, messageData.senderId);
          if (!isMember) {
            throw DomainErrorFactory.createMessageValidation('Sender is not a member of this channel');
          }

          // 메시지 엔티티 생성
          const messageEntity = MessageEntity.create({
            content: messageData.content,
            channelId: messageData.channelId,
            senderId: messageData.senderId,
            type: messageData.type || 'text',
            metadata: messageData.metadata,
            replyTo: messageData.replyTo,
          });

          // 메시지 저장
          const savedMessage = await this.messageRepository.save(messageEntity);

          // 채널의 마지막 메시지 시간 업데이트
          await this.channelRepository.updateLastMessage(messageData.channelId);

          return this.mapToMessageProfile(savedMessage);
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'MessageService.sendMessage',
            messageData
          });
          throw error;
        }
      },
      { channelId: messageData.channelId, messageType: messageData.type || 'text' }
    );
  }

  /**
   * 메시지 조회
   */
  async getMessage(messageId: string): Promise<MessageProfile> {
    return await this.performanceService.measurePerformance(
      'get_message',
      async () => {
        try {
          const message = await this.messageRepository.findById(messageId);

          if (!message) {
            throw DomainErrorFactory.createMessageNotFound(messageId);
          }

          return this.mapToMessageProfile(message);
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'MessageService.getMessage',
            messageId
          });
          throw error;
        }
      },
      { messageId }
    );
  }

  /**
   * 채널 메시지 목록 조회
   */
  async getChannelMessages(channelId: string, limit: number = 50, offset: number = 0): Promise<{
    messages: MessageProfile[];
    total: number;
    hasMore: boolean;
  }> {
    return await this.performanceService.measurePerformance(
      'get_channel_messages',
      async () => {
        try {
          const messages = await this.messageRepository.findByChannelId(channelId, limit, offset);
          const total = await this.messageRepository.countByChannelId(channelId);

          return {
            messages: messages.map(message => this.mapToMessageProfile(message)),
            total,
            hasMore: offset + limit < total
          };
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'MessageService.getChannelMessages',
            channelId,
            limit,
            offset
          });
          throw error;
        }
      },
      { channelId, limit, offset }
    );
  }

  /**
   * 메시지 업데이트
   */
  async updateMessage(messageId: string, updates: Partial<MessageProfile>, userId: string): Promise<MessageProfile> {
    return await this.performanceService.measurePerformance(
      'update_message',
      async () => {
        try {
          const message = await this.messageRepository.findById(messageId);

          if (!message) {
            throw DomainErrorFactory.createMessageNotFound(messageId);
          }

          // 메시지 소유자 확인
          if (message.senderId !== userId) {
            throw new Error('Only message sender can update the message');
          }

          // 입력 검증
          if (this.config.enableValidation && updates.content) {
            const sanitizedContent = this.securityService.sanitizeInput(updates.content);
            if (sanitizedContent.length > (this.config.maxMessageLength || 2000)) {
              throw new Error('Message content is too long');
            }
          }

          const updatedMessage = await this.messageRepository.update(messageId, {
            ...updates,
            isEdited: true,
            updatedAt: new Date()
          });

          return this.mapToMessageProfile(updatedMessage);
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'MessageService.updateMessage',
            messageId,
            userId,
            updates
          });
          throw error;
        }
      },
      { messageId, userId, updateFields: Object.keys(updates) }
    );
  }

  /**
   * 메시지 삭제 (소프트 삭제)
   */
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    return await this.performanceService.measurePerformance(
      'delete_message',
      async () => {
        try {
          const message = await this.messageRepository.findById(messageId);

          if (!message) {
            throw DomainErrorFactory.createMessageNotFound(messageId);
          }

          // 메시지 소유자 확인
          if (message.senderId !== userId) {
            throw new Error('Only message sender can delete the message');
          }

          // 소프트 삭제
          await this.messageRepository.update(messageId, {
            isDeleted: true,
            updatedAt: new Date()
          });

          return true;
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'MessageService.deleteMessage',
            messageId,
            userId
          });
          throw error;
        }
      },
      { messageId, userId }
    );
  }

  /**
   * 메시지 검색
   */
  async searchMessages(query: string, channelId?: string, userId?: string, limit: number = 20): Promise<MessageProfile[]> {
    return await this.performanceService.measurePerformance(
      'search_messages',
      async () => {
        try {
          // 입력 검증
          if (this.config.enableValidation) {
            const sanitizedQuery = this.securityService.sanitizeInput(query);
            if (sanitizedQuery.length < 2) {
              throw new Error('Search query must be at least 2 characters long');
            }
          }

          const messages = await this.messageRepository.search(query, channelId, userId, limit);
          return messages.map(message => this.mapToMessageProfile(message));
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'MessageService.searchMessages',
            query,
            channelId,
            userId,
            limit
          });
          throw error;
        }
      },
      { query, channelId, userId, limit }
    );
  }

  /**
   * 사용자 메시지 목록 조회
   */
  async getUserMessages(userId: string, limit: number = 50, offset: number = 0): Promise<{
    messages: MessageProfile[];
    total: number;
    hasMore: boolean;
  }> {
    return await this.performanceService.measurePerformance(
      'get_user_messages',
      async () => {
        try {
          const messages = await this.messageRepository.findByUserId(userId, limit, offset);
          const total = await this.messageRepository.countByUserId(userId);

          return {
            messages: messages.map(message => this.mapToMessageProfile(message)),
            total,
            hasMore: offset + limit < total
          };
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'MessageService.getUserMessages',
            userId,
            limit,
            offset
          });
          throw error;
        }
      },
      { userId, limit, offset }
    );
  }

  /**
   * 메시지 통계 조회
   */
  async getMessageStats(channelId?: string, userId?: string): Promise<MessageStats> {
    return await this.performanceService.measurePerformance(
      'get_message_stats',
      async () => {
        try {
          let messages;
          if (channelId) {
            messages = await this.messageRepository.findByChannelId(channelId);
          } else if (userId) {
            messages = await this.messageRepository.findByUserId(userId);
          } else {
            messages = await this.messageRepository.findAll();
          }

          const totalMessages = messages.length;
          const messagesByType: Record<string, number> = {};
          let totalLength = 0;
          let lastMessageAt = new Date(0);

          messages.forEach(message => {
            const type = message.type || 'text';
            messagesByType[type] = (messagesByType[type] || 0) + 1;
            totalLength += message.content.length;
            if (message.createdAt > lastMessageAt) {
              lastMessageAt = message.createdAt;
            }
          });

          return {
            totalMessages,
            messagesByType,
            averageLength: totalMessages > 0 ? totalLength / totalMessages : 0,
            lastMessageAt
          };
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'MessageService.getMessageStats',
            channelId,
            userId
          });
          throw error;
        }
      },
      { channelId, userId }
    );
  }

  /**
   * 메시지 존재 여부 확인
   */
  async messageExists(messageId: string): Promise<boolean> {
    try {
      const message = await this.messageRepository.findById(messageId);
      return !!message && !message.isDeleted;
    } catch (error) {
      this.errorService.logError(error, { 
        context: 'MessageService.messageExists',
        messageId
      });
      return false;
    }
  }

  /**
   * 메시지 엔티티를 MessageProfile로 변환
   */
  private mapToMessageProfile(message: any): MessageProfile {
    return {
      id: message.id,
      content: message.content,
      channelId: message.channelId,
      senderId: message.senderId,
      type: message.type || 'text',
      metadata: message.metadata,
      replyTo: message.replyTo,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isEdited: message.isEdited || false,
      isDeleted: message.isDeleted || false
    };
  }
} 