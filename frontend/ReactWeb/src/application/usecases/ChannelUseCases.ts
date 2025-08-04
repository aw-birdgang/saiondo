import type { ChannelService } from '../services/ChannelService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  AddMemberRequest,
  AddMemberResponse,
  CreateChannelRequest,
  CreateChannelResponse,
  GetChannelRequest,
  GetChannelResponse,
  GetChannelsRequest,
  GetChannelsResponse,
  RemoveMemberRequest,
  RemoveMemberResponse,
  UpdateChannelRequest,
  UpdateChannelResponse
} from '../dto/ChannelDto';

export class ChannelUseCases {
  constructor(private readonly channelService: ChannelService) {}

  async createChannel(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    try {
      const channelProfile = await this.channelService.createChannel({
        name: request.name,
        description: request.description,
        type: request.type,
        ownerId: request.ownerId,
        members: request.members,
      });

      return { channel: channelProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to create channel');
    }
  }

  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    try {
      const channelProfile = await this.channelService.getChannel(request.id);
      return { channel: channelProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to get channel');
    }
  }

  async getChannels(request: GetChannelsRequest): Promise<GetChannelsResponse> {
    try {
      const channels = await this.channelService.getUserChannels(request.userId || '');
      return { 
        channels, 
        total: channels.length, 
        hasMore: false 
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to get channels');
    }
  }

  async updateChannel(request: UpdateChannelRequest): Promise<UpdateChannelResponse> {
    try {
      const channelProfile = await this.channelService.updateChannel(request.id, {
        name: request.name,
        description: request.description,
      });

      return { channel: channelProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to update channel');
    }
  }

  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    try {
      const channelProfile = await this.channelService.addMember(request.channelId, request.userId);
      return { channel: channelProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to add member');
    }
  }

  async removeMember(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    try {
      const channelProfile = await this.channelService.removeMember(request.channelId, request.userId);
      return { channel: channelProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to remove member');
    }
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    try {
      return await this.channelService.isMember(channelId, userId);
    } catch (error) {
      return false;
    }
  }
} 