import type { Message } from '../types/message';

export interface IMessageRepository {
  // 기본 CRUD 작업
  findAll(): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
  create(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'toJSON'>): Promise<Message>;
  update(id: string, updates: Partial<Message>): Promise<Message>;
  delete(id: string): Promise<void>;
  save(message: Message): Promise<Message>;
  editContent(messageId: string, content: string): Promise<Message>;

  // 채널별 메시지 조회
  findByChannelId(channelId: string, limit?: number, offset?: number): Promise<Message[]>;
  getChannelMessageCount(channelId: string): Promise<number>;

  // 사용자별 메시지 조회
  findByUserId(userId: string, limit?: number, offset?: number): Promise<Message[]>;
  getUserMessageCount(userId: string): Promise<number>;

  // 검색
  searchByContent(content: string, channelId?: string): Promise<Message[]>;
  searchBySender(senderId: string, channelId?: string): Promise<Message[]>;

  // 읽음 상태 관리
  markAsRead(messageId: string, userId: string): Promise<void>;
  markChannelAsRead(channelId: string, userId: string): Promise<void>;
  getUnreadCount(channelId: string, userId: string): Promise<number>;

  // 반응 관리
  addReaction(messageId: string, userId: string, emoji: string): Promise<void>;
  removeReaction(messageId: string, userId: string, emoji: string): Promise<void>;
  getReactions(messageId: string): Promise<{ emoji: string; count: number; users: string[] }[]>;

  // 파일 첨부
  attachFile(messageId: string, fileUrl: string, fileName: string): Promise<void>;
  getAttachments(messageId: string): Promise<{ url: string; name: string }[]>;

  // 통계
  getMessageStats(channelId: string): Promise<{
    totalMessages: number;
    todayMessages: number;
    averageMessagesPerDay: number;
  }>;
} 