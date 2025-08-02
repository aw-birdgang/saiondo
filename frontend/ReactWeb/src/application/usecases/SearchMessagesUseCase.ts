import type { IChannelRepository, IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { Message } from '../../domain/dto/MessageDto';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type { SearchMessagesRequest, SearchMessagesResponse } from '../dto/SearchMessagesDto';

export class SearchMessagesUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository
  ) {}

  async execute(request: SearchMessagesRequest): Promise<SearchMessagesResponse> {
    try {
      // Validate request
      if (!request.query || request.query.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Search query is required');
      }

      if (request.query.length < 2) {
        throw DomainErrorFactory.createMessageValidation('Search query must be at least 2 characters');
      }

      // If channelId is provided, verify user has access to it
      if (request.channelId) {
        // In real implementation, you would check user permissions here
        const channel = await this.channelRepository.findById(request.channelId);
        if (!channel) {
          throw DomainErrorFactory.createChannelNotFound(request.channelId);
        }
      }

      // Search messages
      const messages = await this.messageRepository.search(
        request.query,
        request.channelId,
        request.userId,
        request.limit || 50,
        request.offset || 0,
        request.dateFrom,
        request.dateTo
      );

      return {
        messages: messages.map(msg => msg.toJSON()),
        total: messages.length,
        hasMore: messages.length === (request.limit || 50),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to search messages');
    }
  }
} 