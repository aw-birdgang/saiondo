import type { IMessageRepository } from '@/domain/repositories/IMessageRepository';
import { DomainErrorFactory } from '@/domain/errors/DomainError';
import type {
  CreateMessageRequest,
  CreateMessageResponse,
  GetMessageRequest,
  GetMessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  UpdateMessageRequest,
  UpdateMessageResponse,
  DeleteMessageRequest,
  DeleteMessageResponse,
  SearchMessagesRequest,
  SearchMessagesResponse,
} from '@/application/dto/MessageDto';

/**
 * MessageUseCase - 메시지 관련 모든 기능을 통합한 Use Case
 * 메시지 전송, 조회, 검색, 실시간 채팅 등을 포함
 */
export class MessageUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository
  ) {}

  // ==================== 메시지 전송 ====================

  /**
   * 메시지 전송
   */
  async sendMessage(
    request: CreateMessageRequest
  ): Promise<CreateMessageResponse> {
    try {
      // 입력 검증
      this.validateMessageRequest(request);

      // 메시지 생성
      const message = await this.messageRepository.create({
        content: request.content,
        channelId: request.channelId,
        senderId: request.senderId,
        type: request.type || 'text',
        metadata: request.metadata,
        replyTo: request.replyTo,
      });

      return {
        message,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to send message');
    }
  }

  /**
   * 파일 메시지 전송
   */
  async sendFileMessage(
    fileData: any
  ): Promise<CreateMessageResponse> {
    try {
      // 파일 메시지 생성
      const message = await this.messageRepository.create({
        content: fileData.content || '',
        channelId: fileData.channelId,
        senderId: fileData.senderId,
        type: 'file',
        metadata: {
          fileName: fileData.fileName,
          fileSize: fileData.fileSize,
          fileUrl: fileData.fileUrl,
          mimeType: fileData.mimeType,
        },
      });

      return {
        message,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to send file message');
    }
  }

  // ==================== 메시지 조회 ====================

  /**
   * 메시지 조회
   */
  async getMessage(request: GetMessageRequest): Promise<GetMessageResponse> {
    try {
      const message = await this.messageRepository.findById(request.messageId);

      if (!message) {
        throw DomainErrorFactory.createUserValidation('Message not found');
      }

      return {
        message,
        success: true,
        cached: false,
        fetchedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get message');
    }
  }

  /**
   * 채널 메시지 목록 조회
   */
  async getMessages(request: GetMessagesRequest): Promise<GetMessagesResponse> {
    try {
      const messages = await this.messageRepository.findByChannel(
        request.channelId,
        {
          limit: request.limit || 50,
          offset: request.offset || 0,
        }
      );

      const total = await this.messageRepository.getCountByChannel(request.channelId);

      return {
        messages,
        total,
        hasMore: total > (request.offset || 0) + (request.limit || 50),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get messages');
    }
  }

  /**
   * 메시지 히스토리 조회
   */
  async getMessageHistory(
    channelId: string,
    limit: number = 50
  ): Promise<GetMessagesResponse> {
    try {
      const messages = await this.messageRepository.findByChannel(channelId, {
        limit,
        offset: 0,
      });

      const total = await this.messageRepository.getCountByChannel(channelId);

      return {
        messages,
        total,
        hasMore: total > limit,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get message history');
    }
  }

  // ==================== 메시지 관리 ====================

  /**
   * 메시지 업데이트
   */
  async updateMessage(
    request: UpdateMessageRequest
  ): Promise<UpdateMessageResponse> {
    try {
      const message = await this.messageRepository.update(
        request.messageId,
        { content: request.content }
      );

      return {
        message,
        success: true,
        updatedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update message');
    }
  }

  /**
   * 메시지 삭제
   */
  async deleteMessage(
    request: DeleteMessageRequest
  ): Promise<DeleteMessageResponse> {
    try {
      await this.messageRepository.delete(request.messageId);

      return {
        success: true,
        message: 'Message deleted successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to delete message');
    }
  }

  /**
   * 메시지 반응 추가
   */
  async reactToMessage(
    messageId: string,
    reaction: string
  ): Promise<void> {
    try {
      await this.messageRepository.addReaction(messageId, reaction);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to add reaction');
    }
  }

  /**
   * 메시지 반응 제거
   */
  async removeReaction(
    messageId: string,
    reaction: string
  ): Promise<void> {
    try {
      await this.messageRepository.removeReaction(messageId, reaction);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to remove reaction');
    }
  }

  /**
   * 메시지 반응 조회
   */
  async getMessageReactions(messageId: string): Promise<any[]> {
    try {
      return await this.messageRepository.getReactions(messageId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get message reactions');
    }
  }

  // ==================== 검색 관련 ====================

  /**
   * 메시지 검색
   */
  async searchMessages(
    request: SearchMessagesRequest
  ): Promise<SearchMessagesResponse> {
    try {
      const messages = await this.messageRepository.search(request.query, {
        channelId: request.channelId,
        userId: request.userId,
        limit: request.limit || 20,
      });

      return {
        messages,
        total: messages.length,
        hasMore: false,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search messages');
    }
  }

  /**
   * 사용자별 메시지 검색
   */
  async searchMessagesByUser(
    userId: string,
    query: string
  ): Promise<SearchMessagesResponse> {
    try {
      const messages = await this.messageRepository.searchByUser(userId, query);

      return {
        messages,
        total: messages.length,
        hasMore: false,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search messages by user');
    }
  }

  /**
   * 채널별 메시지 검색
   */
  async searchMessagesByChannel(
    channelId: string,
    query: string
  ): Promise<SearchMessagesResponse> {
    try {
      const messages = await this.messageRepository.searchByChannel(channelId, query);

      return {
        messages,
        total: messages.length,
        hasMore: false,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search messages by channel');
    }
  }

  // ==================== 파일 메시지 ====================

  /**
   * 파일 메시지 조회
   */
  async getFileMessages(channelId: string): Promise<any[]> {
    try {
      return await this.messageRepository.findByType(channelId, 'file');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get file messages');
    }
  }

  /**
   * 파일 메시지 정보 조회
   */
  async getFileMessageInfo(messageId: string): Promise<any> {
    try {
      const message = await this.messageRepository.findById(messageId);
      if (!message || message.type !== 'file') {
        throw DomainErrorFactory.createUserValidation('File message not found');
      }

      return {
        messageId,
        fileName: message.metadata?.fileName,
        fileSize: message.metadata?.fileSize,
        fileUrl: message.metadata?.fileUrl,
        mimeType: message.metadata?.mimeType,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get file message info');
    }
  }

  // ==================== 실시간 채팅 ====================

  /**
   * 실시간 채팅 연결
   */
  async connectToRealTimeChat(channelId: string): Promise<void> {
    try {
      // 실제 구현에서는 WebSocket 연결 로직 추가
      console.log(`Connecting to real-time chat for channel: ${channelId}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to connect to real-time chat');
    }
  }

  /**
   * 실시간 채팅 연결 해제
   */
  async disconnectFromRealTimeChat(channelId: string): Promise<void> {
    try {
      // 실제 구현에서는 WebSocket 연결 해제 로직 추가
      console.log(`Disconnecting from real-time chat for channel: ${channelId}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to disconnect from real-time chat');
    }
  }

  // ==================== 유틸리티 메서드 ====================

  /**
   * 메시지 존재 여부 확인
   */
  async messageExists(messageId: string): Promise<boolean> {
    try {
      const message = await this.messageRepository.findById(messageId);
      return !!message;
    } catch (error) {
      return false;
    }
  }

  /**
   * 채널 메시지 수 조회
   */
  async getMessageCount(channelId: string): Promise<number> {
    try {
      return await this.messageRepository.getCountByChannel(channelId);
    } catch (error) {
      console.error('Failed to get message count:', error);
      return 0;
    }
  }

  /**
   * 최근 메시지 조회
   */
  async getRecentMessages(
    channelId: string,
    limit: number = 10
  ): Promise<GetMessagesResponse> {
    try {
      const messages = await this.messageRepository.findByChannel(channelId, {
        limit,
        offset: 0,
      });

      const total = await this.messageRepository.getCountByChannel(channelId);

      return {
        messages,
        total,
        hasMore: total > limit,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get recent messages');
    }
  }

  // ==================== 검증 메서드 ====================

  /**
   * 메시지 요청 검증
   */
  private validateMessageRequest(request: CreateMessageRequest): void {
    if (!request.content || request.content.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('Message content is required');
    }

    if (!request.channelId) {
      throw DomainErrorFactory.createUserValidation('Channel ID is required');
    }

    if (!request.senderId) {
      throw DomainErrorFactory.createUserValidation('Sender ID is required');
    }

    if (request.content.length > 1000) {
      throw DomainErrorFactory.createUserValidation('Message content is too long');
    }
  }
} 