import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { Channel } from '../../domain/dto/ChannelDto';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type { LeaveChannelRequest, LeaveChannelResponse } from '../dto/LeaveChannelDto';

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

      // Check if channel exists
      const channel = await this.channelRepository.findById(request.channelId);
      if (!channel) {
        throw DomainErrorFactory.createChannelNotFound(request.channelId);
      }

      // Check if user is member of the channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.userId);
      if (!isMember) {
        throw DomainErrorFactory.createChannelValidation('User is not a member of this channel');
      }

      // Check if user is the owner (owners cannot leave, they must transfer ownership first)
      if (channel.isOwner(request.userId)) {
        throw DomainErrorFactory.createChannelValidation('Channel owner cannot leave. Transfer ownership first.');
      }

      // Remove user from channel
      await this.channelRepository.removeMember(request.channelId, request.userId);

      return {
        success: true,
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