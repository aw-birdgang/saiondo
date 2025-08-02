import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { Channel } from '../../domain/dto/ChannelDto';
import { ChannelEntity } from '../../domain/entities/Channel';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type { CreateChannelRequest, CreateChannelResponse } from '../dto/CreateChannelDto';

export class CreateChannelUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    try {
      // Validate request
      if (!request.name || request.name.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Channel name is required');
      }

      if (request.name.length > 50) {
        throw DomainErrorFactory.createChannelValidation('Channel name must be less than 50 characters');
      }

      if (!request.ownerId || request.ownerId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Channel owner is required');
      }

      if (!request.members.includes(request.ownerId)) {
        throw DomainErrorFactory.createChannelValidation('Channel owner must be a member');
      }

      if (request.type === 'direct' && request.members.length !== 2) {
        throw DomainErrorFactory.createChannelValidation('Direct channels must have exactly 2 members');
      }

      // Create channel entity
      const channelEntity = ChannelEntity.create({
        name: request.name,
        description: request.description,
        type: request.type,
        ownerId: request.ownerId,
        members: request.members,
      });

      // Save to repository
      const savedChannel = await this.channelRepository.save(channelEntity);

      return { channel: savedChannel.toJSON() };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to create channel');
    }
  }
} 