import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { IUserRepository } from '../repositories/IUserRepository';
import type { Channel } from '../entities/Channel';
import { DomainErrorFactory } from '../errors/DomainError';

export interface LeaveChannelRequest {
  channelId: string;
  userId: string;
}

export interface LeaveChannelResponse {
  channel: Channel;
  message: string;
}

export class LeaveChannelUseCase {
  constructor(
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: LeaveChannelRequest): Promise<LeaveChannelResponse> {
    try {
      // Validate request
      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Channel ID is required');
      }

      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('User ID is required');
      }

      // Get channel
      const channel = await this.channelRepository.findById(request.channelId);
      if (!channel) {
        throw DomainErrorFactory.createChannelNotFound(request.channelId);
      }

      // Check if user is a member
      if (!channel.isMember(request.userId)) {
        throw DomainErrorFactory.createChannelValidation('User is not a member of this channel');
      }

      // Check if user is the owner
      if (channel.isOwner(request.userId)) {
        throw DomainErrorFactory.createChannelValidation('Channel owner cannot leave. Transfer ownership or delete the channel.');
      }

      // Remove user from channel
      const updatedChannel = await this.channelRepository.removeMember(request.channelId, request.userId);

      return {
        channel: updatedChannel.toJSON(),
        message: 'Successfully left the channel',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to leave channel');
    }
  }
} 