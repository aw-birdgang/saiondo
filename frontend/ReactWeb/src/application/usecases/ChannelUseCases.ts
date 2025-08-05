import type { IChannelUseCase } from './interfaces/IChannelUseCase';
// ChannelUseCaseService가 삭제되었으므로 any 타입으로 대체
type ChannelUseCaseService = any;
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
} from '../dto/ChannelDto';

/**
 * ChannelUseCases - ChannelUseCaseService를 사용하여 채널 관련 애플리케이션 로직 조율
 * 새로운 UseCase Service 구조를 활용
 */
export class ChannelUseCases implements IChannelUseCase {
  constructor(private readonly channelUseCaseService: ChannelUseCaseService) {}

  /**
   * 채널 생성
   */
  async createChannel(
    request: CreateChannelRequest
  ): Promise<CreateChannelResponse> {
    const response = await this.channelUseCaseService.createChannel(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create channel');
    }

    return response;
  }

  /**
   * 채널 조회
   */
  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    const response = await this.channelUseCaseService.getChannel(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get channel');
    }

    return response;
  }

  /**
   * 사용자 채널 목록 조회
   */
  async getChannels(request: GetChannelsRequest): Promise<GetChannelsResponse> {
    const response = await this.channelUseCaseService.getChannels(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get channels');
    }

    return response;
  }

  /**
   * 채널 업데이트
   */
  async updateChannel(
    request: UpdateChannelRequest
  ): Promise<UpdateChannelResponse> {
    const response = await this.channelUseCaseService.updateChannel(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update channel');
    }

    return response;
  }

  /**
   * 멤버 추가
   */
  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    const response = await this.channelUseCaseService.addMember(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to add member');
    }

    return response;
  }

  /**
   * 멤버 제거
   */
  async removeMember(
    request: RemoveMemberRequest
  ): Promise<RemoveMemberResponse> {
    const response = await this.channelUseCaseService.removeMember(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to remove member');
    }

    return response;
  }

  /**
   * 채널 삭제
   */
  async deleteChannel(channelId: string): Promise<boolean> {
    const result = await this.channelUseCaseService.deleteChannel(
      channelId,
      'system'
    ); // 임시로 system 사용

    return result.success;
  }

  /**
   * 채널 멤버 목록 조회
   */
  async getChannelMembers(channelId: string): Promise<string[]> {
    // 임시 구현 (실제로는 ChannelUseCaseService에 getChannelMembers 메서드 추가 필요)
    throw new Error(
      'Get channel members not implemented in ChannelUseCaseService yet'
    );
  }

  /**
   * 멤버 여부 확인
   */
  async isMember(channelId: string, userId: string): Promise<boolean> {
    return await this.channelUseCaseService.isMember(channelId, userId);
  }

  /**
   * 채널 상태 업데이트
   */
  async updateChannelStatus(
    channelId: string,
    status: string
  ): Promise<boolean> {
    // 임시 구현 (실제로는 ChannelUseCaseService에 updateChannelStatus 메서드 추가 필요)
    throw new Error(
      'Update channel status not implemented in ChannelUseCaseService yet'
    );
  }

  /**
   * 채널 검색
   */
  async searchChannels(
    query: string,
    userId?: string,
    limit: number = 10
  ): Promise<any[]> {
    return await this.channelUseCaseService.searchChannels(
      query,
      userId,
      limit
    );
  }

  /**
   * 채널 통계 조회
   */
  async getChannelStats(channelId: string): Promise<any> {
    return await this.channelUseCaseService.getChannelStats(channelId);
  }

  /**
   * 채널 요청 검증
   */
  validateChannelRequest(
    request: CreateChannelRequest | UpdateChannelRequest
  ): string[] {
    // 임시 구현 (실제로는 더 상세한 검증 로직 필요)
    const errors: string[] = [];

    if (
      'name' in request &&
      (!request.name || request.name.trim().length === 0)
    ) {
      errors.push('Channel name is required');
    }

    if ('name' in request && request.name && request.name.length > 50) {
      errors.push('Channel name must be at most 50 characters');
    }

    return errors;
  }

  /**
   * 채널명 검증
   */
  validateChannelName(name: string): boolean {
    return name && name.trim().length > 0 && name.length <= 50;
  }
}
