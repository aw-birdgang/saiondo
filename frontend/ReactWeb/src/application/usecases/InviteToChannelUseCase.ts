import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { IUserRepository } from '../repositories/IUserRepository';
import type { Channel } from '../entities/Channel';
import { DomainErrorFactory } from '../errors/DomainError';

export interface InviteToChannelRequest {
  channelId: string;
  inviterId: string;
  inviteeId: string;
}

export interface InviteToChannelResponse {
  channel: Channel;
  invitationCode: string;
}

export class InviteToChannelUseCase {
  constructor(
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: InviteToChannelRequest): Promise<InviteToChannelResponse> {
    try {
      // Validate request
      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Channel ID is required');
      }

      if (!request.inviterId || request.inviterId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Inviter ID is required');
      }

      if (!request.inviteeId || request.inviteeId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Invitee ID is required');
      }

      if (request.inviterId === request.inviteeId) {
        throw DomainErrorFactory.createChannelValidation('Cannot invite yourself');
      }

      // Get channel
      const channel = await this.channelRepository.findById(request.channelId);
      if (!channel) {
        throw DomainErrorFactory.createChannelNotFound(request.channelId);
      }

      // Check if inviter is owner or member
      if (!channel.isOwner(request.inviterId) && !channel.isMember(request.inviterId)) {
        throw DomainErrorFactory.createChannelValidation('Only channel members can invite others');
      }

      // Check if invitee is already a member
      if (channel.isMember(request.inviteeId)) {
        throw DomainErrorFactory.createChannelValidation('User is already a member of this channel');
      }

      // Check if invitee exists
      const invitee = await this.userRepository.findById(request.inviteeId);
      if (!invitee) {
        throw DomainErrorFactory.createUserNotFound(request.inviteeId);
      }

      // Add member to channel
      const updatedChannel = await this.channelRepository.addMember(request.channelId, request.inviteeId);

      // Generate invitation code (in real implementation, this would be stored in database)
      const invitationCode = this.generateInvitationCode(request.channelId, request.inviterId);

      return {
        channel: updatedChannel.toJSON(),
        invitationCode,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to invite user to channel');
    }
  }

  private generateInvitationCode(channelId: string, inviterId: string): string {
    // In real implementation, this would create a unique invitation code
    // and store it in the database with expiration time
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${channelId}_${inviterId}_${timestamp}_${random}`;
  }
} 