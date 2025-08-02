import type { Message } from '../entities/Message';

export interface IMessageRepository {
  findById(id: string): Promise<Message | null>;
  save(message: Message): Promise<Message>;
  update(id: string, message: Partial<Message>): Promise<Message>;
  delete(id: string): Promise<void>;
  findByChannelId(channelId: string, limit?: number, offset?: number): Promise<Message[]>;
  findByUserId(userId: string): Promise<Message[]>;
  findRecentByChannelId(channelId: string, limit: number): Promise<Message[]>;
  countByChannelId(channelId: string): Promise<number>;
} 