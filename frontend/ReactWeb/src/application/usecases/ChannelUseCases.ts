import type { IChannelService } from './interfaces/IChannelService';
import type { IChannelUseCase } from './interfaces/IChannelUseCase';
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

// Channel UseCase 구현체 - Service를 사용하여 애플리케이션 로직 조율
export class ChannelUseCases implements IChannelUseCase {
  constructor(private readonly channelService: IChannelService) {}

  async createChannel(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    return await this.channelService.createChannel(request);
  }

  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    return await this.channelService.getChannel(request);
  }

  async getChannels(request: GetChannelsRequest): Promise<GetChannelsResponse> {
    return await this.channelService.getChannels(request);
  }

  async updateChannel(request: UpdateChannelRequest): Promise<UpdateChannelResponse> {
    return await this.channelService.updateChannel(request);
  }

  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    return await this.channelService.addMember(request);
  }

  async removeMember(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    return await this.channelService.removeMember(request);
  }

  async deleteChannel(channelId: string): Promise<boolean> {
    return await this.channelService.deleteChannel(channelId);
  }

  async getChannelMembers(channelId: string): Promise<string[]> {
    return await this.channelService.getChannelMembers(channelId);
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    return await this.channelService.isMember(channelId, userId);
  }

  async updateChannelStatus(channelId: string, status: string): Promise<boolean> {
    return await this.channelService.updateChannelStatus(channelId, status);
  }

  validateChannelRequest(request: CreateChannelRequest | UpdateChannelRequest): string[] {
    return this.channelService.validateChannelRequest(request);
  }

  validateChannelName(name: string): boolean {
    return this.channelService.validateChannelName(name);
  }
} 