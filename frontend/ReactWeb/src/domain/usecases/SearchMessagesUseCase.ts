import type { IMessageRepository } from '../repositories/IMessageRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { Message } from '../entities/Message';
import { DomainErrorFactory } from '../errors/DomainError';

export interface SearchMessagesRequest {
  query: string;
  channelId?: string;
  userId?: string;
  limit?: number;
  offset?: number;
  searchInContent?: boolean;
  searchInMetadata?: boolean;
}

export interface SearchMessagesResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

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

      if (request.query.length > 100) {
        throw DomainErrorFactory.createMessageValidation('Search query must be less than 100 characters');
      }

      // Set defaults
      const limit = request.limit || 20;
      const offset = request.offset || 0;
      const searchInContent = request.searchInContent !== false; // default to true
      const searchInMetadata = request.searchInMetadata || false;

      let messages: Message[] = [];

      // Search in specific channel
      if (request.channelId) {
        // Verify channel exists
        const channel = await this.channelRepository.findById(request.channelId);
        if (!channel) {
          throw DomainErrorFactory.createChannelNotFound(request.channelId);
        }

        // Get messages from channel and filter
        const channelMessages = await this.messageRepository.findByChannelId(
          request.channelId,
          limit * 2, // Get more messages to filter
          offset
        );

        messages = this.filterMessages(channelMessages, request.query, searchInContent, searchInMetadata);
      }
      // Search in user's messages
      else if (request.userId) {
        const userMessages = await this.messageRepository.findByUserId(request.userId);
        messages = this.filterMessages(userMessages, request.query, searchInContent, searchInMetadata);
      }
      // Search in all messages (admin functionality)
      else {
        // This would need to be implemented in the repository
        // For now, we'll return empty results
        messages = [];
      }

      // Apply pagination
      const paginatedMessages = messages.slice(offset, offset + limit);
      const hasMore = messages.length > offset + limit;

      return {
        messages: paginatedMessages.map(message => (message as any).toJSON()),
        total: messages.length,
        hasMore,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to search messages');
    }
  }

  private filterMessages(
    messages: any[],
    query: string,
    searchInContent: boolean,
    searchInMetadata: boolean
  ): any[] {
    const lowerQuery = query.toLowerCase();

    return messages.filter(message => {
      // Search in content
      if (searchInContent && message.content.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Search in metadata
      if (searchInMetadata && message.metadata) {
        const metadataString = JSON.stringify(message.metadata).toLowerCase();
        if (metadataString.includes(lowerQuery)) {
          return true;
        }
      }

      return false;
    });
  }
} 