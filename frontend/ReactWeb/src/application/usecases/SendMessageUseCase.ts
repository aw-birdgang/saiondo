import type {IMessageRepository} from '../../domain/repositories/IMessageRepository';
import type {IChannelRepository} from '../../domain/repositories/IChannelRepository';
import {MessageEntity} from '../../domain/entities/Message';
import {DomainErrorFactory} from '../../domain/errors/DomainError';
import type {SendMessageRequest, SendMessageResponse} from '../dto/SendMessageDto';

export class SendMessageUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository
  ) {}

  async execute(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      // Validate request
      if (!request.content || request.content.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Message content is required');
      }

      if (request.content.length > 2000) {
        throw DomainErrorFactory.createMessageValidation('Message content must be less than 2000 characters');
      }

      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Channel ID is required');
      }

      if (!request.senderId || request.senderId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Sender ID is required');
      }

      // Check if sender is member of the channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.senderId);
      if (!isMember) {
        throw DomainErrorFactory.createMessageValidation('Sender is not a member of this channel');
      }

      // Create message entity
      const messageEntity = MessageEntity.create({
        content: request.content,
        channelId: request.channelId,
        senderId: request.senderId,
        type: request.type,
        metadata: request.metadata,
        replyTo: request.replyTo,
      });

      // Save message
      const savedMessage = await this.messageRepository.save(messageEntity);

      // Update channel's last message timestamp
      await this.channelRepository.updateLastMessage(request.channelId);

      return { message: savedMessage.toJSON() };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to send message');
    }
  }
} 