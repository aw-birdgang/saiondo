import type { ChannelService } from '../services/ChannelService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  InviteToChannelRequest,
  InviteToChannelResponse,
} from '../dto/InviteToChannelDto';

export class InviteToChannelUseCase {
  constructor(private readonly channelService: ChannelService) {}

  async execute(
    request: InviteToChannelRequest
  ): Promise<InviteToChannelResponse> {
    try {
      // Validate request
      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation(
          'Channel ID is required'
        );
      }

      if (!request.inviterId || request.inviterId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation(
          'Inviter ID is required'
        );
      }

      if (!request.inviteeIds || request.inviteeIds.length === 0) {
        throw DomainErrorFactory.createChannelValidation(
          'At least one invitee is required'
        );
      }

      // Check if channel exists
      const channel = await this.channelService.getChannel(request.channelId);

      // Check if inviter is member of the channel
      const isInviterMember = await this.channelService.isMember(
        request.channelId,
        request.inviterId
      );
      if (!isInviterMember) {
        throw DomainErrorFactory.createChannelValidation(
          'Inviter is not a member of this channel'
        );
      }

      const invitedUsers: string[] = [];
      const failedUsers: string[] = [];

      // Process each invitee
      for (const inviteeId of request.inviteeIds) {
        try {
          // Check if user is already a member
          const isAlreadyMember = await this.channelService.isMember(
            request.channelId,
            inviteeId
          );
          if (isAlreadyMember) {
            failedUsers.push(inviteeId);
            continue;
          }

          // Add user to channel
          await this.channelService.addMember(request.channelId, inviteeId);
          invitedUsers.push(inviteeId);
        } catch (error) {
          console.error(`Failed to invite user ${inviteeId}:`, error);
          failedUsers.push(inviteeId);
        }
      }

      return {
        success: invitedUsers.length > 0,
        invitedUsers,
        failedUsers,
        message: `Successfully invited ${invitedUsers.length} users, failed to invite ${failedUsers.length} users`,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to invite users to channel'
      );
    }
  }
}
