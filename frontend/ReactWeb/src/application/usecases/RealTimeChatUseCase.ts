import type {IMessageRepository} from '../../domain/repositories/IMessageRepository';
import type {IChannelRepository} from '../../domain/repositories/IChannelRepository';
import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import {MessageEntity} from '../../domain/entities/Message';
import {DomainErrorFactory} from '../../domain/errors/DomainError';
import type {
  JoinChatRoomRequest,
  JoinChatRoomResponse,
  LeaveChatRoomRequest,
  LeaveChatRoomResponse,
  ReadReceiptRequest,
  ReadReceiptResponse,
  SendRealTimeMessageRequest,
  SendRealTimeMessageResponse,
  TypingIndicatorRequest,
  TypingIndicatorResponse
} from '../dto/RealTimeChatDto';

export class RealTimeChatUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async sendRealTimeMessage(request: SendRealTimeMessageRequest): Promise<SendRealTimeMessageResponse> {
    try {
      // Validate request
      if (!request.message.content || request.message.content.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Message content is required');
      }

      if (!request.message.channelId || request.message.channelId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Channel ID is required');
      }

      if (!request.message.senderId || request.message.senderId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Sender ID is required');
      }

      // Check if sender is member of the channel
      const isMember = await this.channelRepository.isMember(request.message.channelId, request.message.senderId);
      if (!isMember) {
        throw DomainErrorFactory.createMessageValidation('Sender is not a member of this channel');
      }

      // Create message entity
      const messageEntity = MessageEntity.create({
        content: request.message.content,
        channelId: request.message.channelId,
        senderId: request.message.senderId,
        type: request.message.type,
        metadata: request.message.metadata,
        replyTo: request.message.replyTo,
      });

      // Save message
      const savedMessage = await this.messageRepository.save(messageEntity);

      // Update channel's last message timestamp
      await this.channelRepository.updateLastMessage(request.message.channelId);

      return {
        success: true,
        messageId: savedMessage.id,
        timestamp: savedMessage.createdAt,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to send real-time message');
    }
  }

  async sendTypingIndicator(request: TypingIndicatorRequest): Promise<TypingIndicatorResponse> {
    try {
      // Validate request
      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('User ID is required');
      }

      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Channel ID is required');
      }

      // Check if user is member of the channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.userId);
      if (!isMember) {
        throw DomainErrorFactory.createChannelValidation('User is not a member of this channel');
      }

      // In real implementation, this would broadcast to other channel members
      console.log(`User ${request.userId} is ${request.isTyping ? 'typing' : 'not typing'} in channel ${request.channelId}`);

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to send typing indicator');
    }
  }

  async sendReadReceipt(request: ReadReceiptRequest): Promise<ReadReceiptResponse> {
    try {
      // Validate request
      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('User ID is required');
      }

      if (!request.messageId || request.messageId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Message ID is required');
      }

      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Channel ID is required');
      }

      // Check if message exists
      const message = await this.messageRepository.findById(request.messageId);
      if (!message) {
        throw DomainErrorFactory.createMessageNotFound(request.messageId);
      }

      // Check if user is member of the channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.userId);
      if (!isMember) {
        throw DomainErrorFactory.createChannelValidation('User is not a member of this channel');
      }

      // In real implementation, this would update read receipts in database
      console.log(`User ${request.userId} read message ${request.messageId} in channel ${request.channelId}`);

      return {
        success: true,
        readAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to send read receipt');
    }
  }

  async joinChatRoom(request: JoinChatRoomRequest): Promise<JoinChatRoomResponse> {
    try {
      // Validate request
      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('User ID is required');
      }

      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Channel ID is required');
      }

      // Check if channel exists
      const channel = await this.channelRepository.findById(request.channelId);
      if (!channel) {
        throw DomainErrorFactory.createChannelNotFound(request.channelId);
      }

      // Check if user is already a member
      const isMember = await this.channelRepository.isMember(request.channelId, request.userId);
      if (!isMember) {
        throw DomainErrorFactory.createChannelValidation('User is not a member of this channel');
      }

      // Get channel participants
      const participants = channel.members;

      return {
        success: true,
        participants,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to join chat room');
    }
  }

  async leaveChatRoom(request: LeaveChatRoomRequest): Promise<LeaveChatRoomResponse> {
    try {
      // Validate request
      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('User ID is required');
      }

      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Channel ID is required');
      }

      // Check if user is member of the channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.userId);
      if (!isMember) {
        throw DomainErrorFactory.createChannelValidation('User is not a member of this channel');
      }

      // In real implementation, this would handle leaving the chat room
      console.log(`User ${request.userId} left chat room ${request.channelId}`);

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to leave chat room');
    }
  }
} 