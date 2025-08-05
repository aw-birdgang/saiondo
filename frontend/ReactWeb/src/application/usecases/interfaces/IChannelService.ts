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

// Channel Service 인터페이스 - 비즈니스 로직 담당
export interface IChannelService {
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
  checkChannelPermissions(userId: string, channelId: string, operation: string): Promise<boolean>;
  processChannelData(channelData: any): any;
} 