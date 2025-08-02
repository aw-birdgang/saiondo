import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { Message } from '../../domain/entities/Message';
import { MessageEntity } from '../../domain/entities/Message';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export interface CreateMessageRequest {
  content: string;
  channelId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
  replyTo?: string;
}

export interface CreateMessageResponse {
  message: Message;
}

export interface GetMessageRequest {
  id: string;
}

export interface GetMessageResponse {
  message: Message;
}

export interface GetMessagesRequest {
  channelId: string;
  limit?: number;
  offset?: number;
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface UpdateMessageRequest {
  id: string;
  content: string;
  userId: string; // For authorization check
}

export interface UpdateMessageResponse {
  message: Message;
}

export interface DeleteMessageRequest {
  id: string;
  userId: string; // For authorization check
}

export interface DeleteMessageResponse {
  success: boolean;
}

export class MessageUseCases {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async createMessage(request: CreateMessageRequest): Promise<CreateMessageResponse> {
    try {
      const messageEntity = MessageEntity.create({
        content: request.content,
        channelId: request.channelId,
        senderId: request.senderId,
        type: request.type,
        metadata: request.metadata,
        replyTo: request.replyTo,
      });

      const message = await this.messageRepository.save(messageEntity.toJSON());
      return { message };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to create message');
    }
  }

  async getMessage(request: GetMessageRequest): Promise<GetMessageResponse> {
    try {
      const message = await this.messageRepository.findById(request.id);
      if (!message) {
        throw DomainErrorFactory.createMessageNotFound(request.id);
      }

      return { message };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get message');
    }
  }

  async getMessages(request: GetMessagesRequest): Promise<GetMessagesResponse> {
    try {
      const messages = await this.messageRepository.findByChannelId(
        request.channelId,
        request.limit,
        request.offset
      );

      return { messages };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get messages');
    }
  }

  async updateMessage(request: UpdateMessageRequest): Promise<UpdateMessageResponse> {
    try {
      const existingMessage = await this.messageRepository.findById(request.id);
      if (!existingMessage) {
        throw DomainErrorFactory.createMessageNotFound(request.id);
      }

      // Check if user can edit this message
      if (existingMessage.senderId !== request.userId) {
        throw DomainErrorFactory.createMessageEditNotAllowed(request.id, request.userId);
      }

      const messageEntity = MessageEntity.fromData(existingMessage);
      const updatedMessageEntity = messageEntity.editContent(request.content);

      const message = await this.messageRepository.save(updatedMessageEntity.toJSON());
      return { message };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to update message');
    }
  }

  async deleteMessage(request: DeleteMessageRequest): Promise<DeleteMessageResponse> {
    try {
      const existingMessage = await this.messageRepository.findById(request.id);
      if (!existingMessage) {
        throw DomainErrorFactory.createMessageNotFound(request.id);
      }

      // Check if user can delete this message
      if (existingMessage.senderId !== request.userId) {
        throw DomainErrorFactory.createMessageEditNotAllowed(request.id, request.userId);
      }

      await this.messageRepository.delete(request.id);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to delete message');
    }
  }

  async getRecentMessages(channelId: string, limit: number): Promise<GetMessagesResponse> {
    try {
      const messages = await this.messageRepository.findRecentByChannelId(channelId, limit);
      return { messages };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get recent messages');
    }
  }

  async getMessageCount(channelId: string): Promise<number> {
    try {
      return await this.messageRepository.countByChannelId(channelId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get message count');
    }
  }
} 