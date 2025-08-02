import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { Channel } from '../../domain/dto/ChannelDto';
import { ChannelEntity } from '../../domain/entities/Channel';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  CreateChannelRequest,
  CreateChannelResponse,
  GetChannelRequest,
  GetChannelResponse,
  GetChannelsRequest,
  GetChannelsResponse,
  UpdateChannelRequest,
  UpdateChannelResponse,
  AddMemberRequest,
  AddMemberResponse,
  RemoveMemberRequest,
  RemoveMemberResponse
} from '../dto/ChannelDto';

export class ChannelUseCases {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async createChannel(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    try {
      const channelEntity = ChannelEntity.create({
        name: request.name,
        description: request.description,
        type: request.type,
        ownerId: request.ownerId,
        members: request.members,
      });

      const channel = await this.channelRepository.save(channelEntity.toJSON());
      return { channel };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to create channel');
    }
  }

  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    try {
      const channel = await this.channelRepository.findById(request.id);
      if (!channel) {
        throw DomainErrorFactory.createChannelNotFound(request.id);
      }

      return { channel };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to get channel');
    }
  }

  async getChannels(request: GetChannelsRequest): Promise<GetChannelsResponse> {
    try {
      const channels = await this.channelRepository.findByUserId(request.userId || '');
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
      const existingChannel = await this.channelRepository.findById(request.id);
      if (!existingChannel) {
        throw DomainErrorFactory.createChannelNotFound(request.id);
      }

      const channelEntity = ChannelEntity.fromData(existingChannel);
      const updatedChannel = await this.channelRepository.save({
        ...existingChannel,
        name: request.name ?? existingChannel.name,
        description: request.description ?? existingChannel.description,
      });

      return { channel: updatedChannel };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to update channel');
    }
  }

  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    try {
      const channel = await this.channelRepository.findById(request.channelId);
      if (!channel) {
        throw DomainErrorFactory.createChannelNotFound(request.channelId);
      }

      const channelEntity = ChannelEntity.fromData(channel);
      const updatedChannelEntity = channelEntity.addMember(request.userId);
      const updatedChannel = await this.channelRepository.save(updatedChannelEntity.toJSON());

      return { channel: updatedChannel };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to add member');
    }
  }

  async removeMember(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    try {
      const channel = await this.channelRepository.findById(request.channelId);
      if (!channel) {
        throw DomainErrorFactory.createChannelNotFound(request.channelId);
      }

      const channelEntity = ChannelEntity.fromData(channel);
      const updatedChannelEntity = channelEntity.removeMember(request.userId);
      const updatedChannel = await this.channelRepository.save(updatedChannelEntity.toJSON());

      return { channel: updatedChannel };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to remove member');
    }
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    try {
      return await this.channelRepository.isMember(channelId, userId);
    } catch (error) {
      return false;
    }
  }
} 