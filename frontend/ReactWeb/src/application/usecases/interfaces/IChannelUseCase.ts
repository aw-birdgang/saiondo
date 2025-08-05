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
} from '../../dto/ChannelDto';

// Channel UseCase 인터페이스 - 애플리케이션 로직 조율
export interface IChannelUseCase {
  createChannel(request: CreateChannelRequest): Promise<CreateChannelResponse>;
  getChannel(request: GetChannelRequest): Promise<GetChannelResponse>;
  getChannels(request: GetChannelsRequest): Promise<GetChannelsResponse>;
  updateChannel(request: UpdateChannelRequest): Promise<UpdateChannelResponse>;
  addMember(request: AddMemberRequest): Promise<AddMemberResponse>;
  removeMember(request: RemoveMemberRequest): Promise<RemoveMemberResponse>;
  deleteChannel(channelId: string): Promise<boolean>;
  getChannelMembers(channelId: string): Promise<string[]>;
  isMember(channelId: string, userId: string): Promise<boolean>;
  updateChannelStatus(channelId: string, status: string): Promise<boolean>;
  validateChannelRequest(request: CreateChannelRequest | UpdateChannelRequest): string[];
  validateChannelName(name: string): boolean;
} 