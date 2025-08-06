import type { IMessageRepository } from '@/domain/repositories/IMessageRepository';
import type { IChannelRepository } from '@/domain/repositories/IChannelRepository';
import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import { MessageId } from '@/domain/value-objects/MessageId';
import { DomainErrorFactory } from '@/domain/errors/DomainError';
import type { Message } from '@/domain/types/message';

/**
 * MessageInfrastructureService - 메시지 관련 모든 기능을 통합한 Infrastructure Service
 * 메시지 전송, 조회, 검색, 실시간 채팅 등을 포함
 */
export class MessageInfrastructureService {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository
  ) {}

  // ==================== 메시지 관리 ====================

  /**
   * 메시지 전송
   */
  async sendMessage(messageData: Partial<Message>): Promise<Message> {
    try {
      const message = await this.messageRepository.create(messageData);
      return message;
    } catch (error) {
      throw DomainErrorFactory.createMessageValidation('Failed to send message');
    }
  }

  /**
   * 메시지 조회
   */
  async getMessage(messageId: string): Promise<Message | null> {
    try {
      const messageIdObj = MessageId.create(messageId);
      const message = await this.messageRepository.findById(messageIdObj.getValue());
      return message;
    } catch (error) {
      throw DomainErrorFactory.createMessageNotFound(messageId);
    }
  }

  /**
   * 메시지 업데이트
   */
  async updateMessage(messageId: string, updates: Partial<Message>): Promise<Message> {
    try {
      const messageIdObj = MessageId.create(messageId);
      const message = await this.messageRepository.update(messageIdObj.getValue(), updates);
      return message;
    } catch (error) {
      throw DomainErrorFactory.createMessageValidation('Failed to update message');
    }
  }

  /**
   * 메시지 삭제
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const messageIdObj = MessageId.create(messageId);
      await this.messageRepository.delete(messageIdObj.getValue());
      return true;
    } catch (error) {
      throw DomainErrorFactory.createMessageValidation('Failed to delete message');
    }
  }

  // ==================== 메시지 조회 ====================

  /**
   * 채널의 메시지 목록 조회
   */
  async getChannelMessages(channelId: string, limit: number = 50): Promise<Message[]> {
    try {
      const messages = await this.messageRepository.findByChannelId(channelId);
      return messages.slice(-limit);
    } catch (error) {
      throw DomainErrorFactory.createMessageNotFound('Channel messages not found');
    }
  }

  /**
   * 사용자의 메시지 목록 조회
   */
  async getUserMessages(userId: string, limit: number = 50): Promise<Message[]> {
    try {
      const messages = await this.messageRepository.findByUserId(userId);
      return messages.slice(-limit);
    } catch (error) {
      throw DomainErrorFactory.createMessageNotFound('User messages not found');
    }
  }

  /**
   * 모든 메시지 조회
   */
  async getAllMessages(): Promise<Message[]> {
    try {
      const messages = await this.messageRepository.findAll();
      return messages;
    } catch (error) {
      throw DomainErrorFactory.createMessageNotFound('Messages not found');
    }
  }

  // ==================== 메시지 검색 ====================

  /**
   * 메시지 검색
   */
  async searchMessages(query: string, limit: number = 20): Promise<Message[]> {
    try {
      const allMessages = await this.messageRepository.findAll();
      const filteredMessages = allMessages.filter(message =>
        message.content.toLowerCase().includes(query.toLowerCase())
      );
      return filteredMessages.slice(0, limit);
    } catch (error) {
      throw DomainErrorFactory.createMessageNotFound('Search failed');
    }
  }

  /**
   * 채널 내 메시지 검색
   */
  async searchChannelMessages(channelId: string, query: string, limit: number = 20): Promise<Message[]> {
    try {
      const channelMessages = await this.messageRepository.findByChannelId(channelId);
      const filteredMessages = channelMessages.filter(message =>
        message.content.toLowerCase().includes(query.toLowerCase())
      );
      return filteredMessages.slice(0, limit);
    } catch (error) {
      throw DomainErrorFactory.createMessageNotFound('Channel search failed');
    }
  }

  /**
   * 사용자 메시지 검색
   */
  async searchUserMessages(userId: string, query: string, limit: number = 20): Promise<Message[]> {
    try {
      const userMessages = await this.messageRepository.findByUserId(userId);
      const filteredMessages = userMessages.filter(message =>
        message.content.toLowerCase().includes(query.toLowerCase())
      );
      return filteredMessages.slice(0, limit);
    } catch (error) {
      throw DomainErrorFactory.createMessageNotFound('User search failed');
    }
  }

  // ==================== 실시간 채팅 ====================

  /**
   * 실시간 메시지 스트림 시작
   */
  async startMessageStream(channelId: string, callback: (message: Message) => void): Promise<void> {
    try {
      // WebSocket 연결 또는 실시간 스트림 설정
      console.log(`Starting message stream for channel: ${channelId}`);
      
      // 실제 구현에서는 WebSocket이나 Server-Sent Events를 사용
      // 여기서는 시뮬레이션
      setInterval(() => {
        // 새로운 메시지가 있을 때 콜백 호출
        // 실제로는 WebSocket 이벤트를 수신
      }, 1000);
    } catch (error) {
      throw DomainErrorFactory.createMessageValidation('Failed to start message stream');
    }
  }

  /**
   * 실시간 메시지 스트림 중지
   */
  async stopMessageStream(channelId: string): Promise<void> {
    try {
      console.log(`Stopping message stream for channel: ${channelId}`);
      // WebSocket 연결 해제 또는 스트림 중지
    } catch (error) {
      throw DomainErrorFactory.createMessageValidation('Failed to stop message stream');
    }
  }

  // ==================== 메시지 통계 ====================

  /**
   * 채널 메시지 통계
   */
  async getChannelMessageStats(channelId: string): Promise<{
    totalMessages: number;
    todayMessages: number;
    averagePerDay: number;
    topUsers: Array<{ userId: string; messageCount: number }>;
  }> {
    try {
      const messages = await this.messageRepository.findByChannelId(channelId);
      const totalMessages = messages.length;

      // 오늘 메시지 수
      const today = new Date();
      const todayMessages = messages.filter(message => {
        const messageDate = new Date(message.createdAt);
        return messageDate.toDateString() === today.toDateString();
      }).length;

      // 사용자별 메시지 수
      const userMessageCounts: Record<string, number> = {};
      messages.forEach(message => {
        const userId = message.userId;
        userMessageCounts[userId] = (userMessageCounts[userId] || 0) + 1;
      });

      const topUsers = Object.entries(userMessageCounts)
        .map(([userId, count]) => ({ userId, messageCount: count }))
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5);

      // 일평균 메시지 수 (최근 7일 기준)
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentMessages = messages.filter(message => 
        new Date(message.createdAt) >= sevenDaysAgo
      );
      const averagePerDay = Math.round(recentMessages.length / 7);

      return {
        totalMessages,
        todayMessages,
        averagePerDay,
        topUsers,
      };
    } catch (error) {
      throw DomainErrorFactory.createMessageNotFound('Failed to get message stats');
    }
  }

  /**
   * 사용자 메시지 통계
   */
  async getUserMessageStats(userId: string): Promise<{
    totalMessages: number;
    todayMessages: number;
    averagePerDay: number;
    favoriteChannels: Array<{ channelId: string; messageCount: number }>;
  }> {
    try {
      const messages = await this.messageRepository.findByUserId(userId);
      const totalMessages = messages.length;

      // 오늘 메시지 수
      const today = new Date();
      const todayMessages = messages.filter(message => {
        const messageDate = new Date(message.createdAt);
        return messageDate.toDateString() === today.toDateString();
      }).length;

      // 채널별 메시지 수
      const channelMessageCounts: Record<string, number> = {};
      messages.forEach(message => {
        const channelId = message.channelId;
        channelMessageCounts[channelId] = (channelMessageCounts[channelId] || 0) + 1;
      });

      const favoriteChannels = Object.entries(channelMessageCounts)
        .map(([channelId, count]) => ({ channelId, messageCount: count }))
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5);

      // 일평균 메시지 수 (최근 7일 기준)
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentMessages = messages.filter(message => 
        new Date(message.createdAt) >= sevenDaysAgo
      );
      const averagePerDay = Math.round(recentMessages.length / 7);

      return {
        totalMessages,
        todayMessages,
        averagePerDay,
        favoriteChannels,
      };
    } catch (error) {
      throw DomainErrorFactory.createMessageNotFound('Failed to get user message stats');
    }
  }

  // ==================== 메시지 권한 ====================

  /**
   * 사용자가 메시지를 수정할 수 있는지 확인
   */
  async canUserEditMessage(userId: string, messageId: string): Promise<boolean> {
    try {
      const message = await this.getMessage(messageId);
      if (!message) {
        return false;
      }

      // 메시지 작성자인지 확인
      if (message.userId === userId) {
        return true;
      }

      // 관리자 권한 확인
      const user = await this.userRepository.findById(userId);
      return user?.role === 'admin';
    } catch (error) {
      return false;
    }
  }

  /**
   * 사용자가 메시지를 삭제할 수 있는지 확인
   */
  async canUserDeleteMessage(userId: string, messageId: string): Promise<boolean> {
    try {
      const message = await this.getMessage(messageId);
      if (!message) {
        return false;
      }

      // 메시지 작성자인지 확인
      if (message.userId === userId) {
        return true;
      }

      // 채널 관리자 권한 확인
      const channel = await this.channelRepository.findById(message.channelId);
      if (channel?.ownerId === userId) {
        return true;
      }

      // 시스템 관리자 권한 확인
      const user = await this.userRepository.findById(userId);
      return user?.role === 'admin';
    } catch (error) {
      return false;
    }
  }
} 