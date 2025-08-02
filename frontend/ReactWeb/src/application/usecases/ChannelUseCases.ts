import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { Channel } from '../../domain/entities/Channel';
import { ChannelEntity } from '../../domain/entities/Channel';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export interface CreateChannelRequest {
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  ownerId: string;
  members: string[];
}

export interface CreateChannelResponse {
  channel: Channel;
}

export interface GetChannelRequest {
  id: string;
}

export interface GetChannelResponse {
  channel: Channel;
}

export interface GetChannelsRequest {
  userId?: string;
  type?: 'public' | 'private' | 'direct';
}

export interface GetChannelsResponse {
  channels: Channel[];
}

export interface UpdateChannelRequest {
  id: string;
  name?: string;
  description?: string;
}

export interface UpdateChannelResponse {
  channel: Channel;
}

export interface AddMemberRequest {
  channelId: string;
  userId: string;
}

export interface AddMemberResponse {
  channel: Channel;
}

export interface RemoveMemberRequest {
  channelId: string;
  userId: string;
}

export interface RemoveMemberResponse {
  channel: Channel;
}

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
      let channels: Channel[];

      if (request.userId) {
        channels = await this.channelRepository.findByUserId(request.userId);
      } else if (request.type) {
        channels = await this.channelRepository.findByType(request.type);
      } else {
        channels = await this.channelRepository.findAll();
      }

      return { channels };
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
      
      // Create updated channel with new data
      const updatedChannel = {
        ...existingChannel,
        name: request.name ?? existingChannel.name,
        description: request.description ?? existingChannel.description,
        updatedAt: new Date(),
      };

      const channel = await this.channelRepository.save(updatedChannel);
      return { channel };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to update channel');
    }
  }

  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    try {
      const existingChannel = await this.channelRepository.findById(request.channelId);
      if (!existingChannel) {
        throw DomainErrorFactory.createChannelNotFound(request.channelId);
      }

      const channelEntity = ChannelEntity.fromData(existingChannel);
      const updatedChannelEntity = channelEntity.addMember(request.userId);

      const channel = await this.channelRepository.save(updatedChannelEntity.toJSON());
      return { channel };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to add member to channel');
    }
  }

  async removeMember(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    try {
      const existingChannel = await this.channelRepository.findById(request.channelId);
      if (!existingChannel) {
        throw DomainErrorFactory.createChannelNotFound(request.channelId);
      }

      const channelEntity = ChannelEntity.fromData(existingChannel);
      const updatedChannelEntity = channelEntity.removeMember(request.userId);

      const channel = await this.channelRepository.save(updatedChannelEntity.toJSON());
      return { channel };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to remove member from channel');
    }
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    try {
      return await this.channelRepository.isMember(channelId, userId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to check channel membership');
    }
  }
} 