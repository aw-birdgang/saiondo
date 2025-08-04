import { ChannelService } from '../services/ChannelService';
import type { CreateChannelRequest, CreateChannelResponse } from '../dto/CreateChannelDto';

export class CreateChannelUseCase {
  constructor(private readonly channelService: ChannelService) {}

  async execute(request: CreateChannelRequest): Promise<CreateChannelResponse> {
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
      throw new Error('Failed to create channel');
    }
  }
} 