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
  UpdateChannelResponse,
} from '../../dto/ChannelDto';

// Channel Repository 인터페이스 - 데이터 접근만 담당
export interface IChannelRepository {
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
}
