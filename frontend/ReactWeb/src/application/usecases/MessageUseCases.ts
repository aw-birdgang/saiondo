import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { Message } from '../../domain/dto/MessageDto';
import { MessageEntity } from '../../domain/entities/Message';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
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
  DeleteMessageResponse
} from '../dto/MessageDto';

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
      return { 
        messages, 
        total: messages.length, 
        hasMore: false 
      };
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

      const messageEntity = MessageEntity.fromData(existingMessage);
      const updatedMessageEntity = messageEntity.editContent(request.content);
      const updatedMessage = await this.messageRepository.save(updatedMessageEntity.toJSON());

      return { message: updatedMessage };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to update message');
    }
  }

  async deleteMessage(request: DeleteMessageRequest): Promise<DeleteMessageResponse> {
    try {
      const message = await this.messageRepository.findById(request.id);
      if (!message) {
        throw DomainErrorFactory.createMessageNotFound(request.id);
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
      const messages = await this.messageRepository.findByChannelId(channelId, limit, 0);
      return { 
        messages, 
        total: messages.length, 
        hasMore: false 
      };
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
      return 0;
    }
  }
} 