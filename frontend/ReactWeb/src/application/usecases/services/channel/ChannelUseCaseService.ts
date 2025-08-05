import type { ILogger } from '../../../../domain/interfaces/ILogger';
import { BaseCacheService, type ICache } from '../../../services/base/BaseCacheService';
import { ChannelService } from '../../../services/channel/ChannelService';
import { UserService } from '../../../services/user/UserService';
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
} from '../../../dto/ChannelDto';

/**
 * ChannelUseCaseService - 채널 관련 UseCase 전용 서비스
 * 캐싱, 권한 검증, DTO 변환 등의 UseCase별 특화 로직 처리
 */
export class ChannelUseCaseService extends BaseCacheService {
  constructor(
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
    cache?: ICache,
    logger?: ILogger
  ) {
    super(cache, logger);
  }

  /**
   * 채널 생성 - 캐시 무효화
   */
  async createChannel(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    try {
      // 권한 검증
      await this.checkChannelPermissions(request.ownerId, 'create_channel');

      // Base Service 호출
      const channel = await this.channelService.createChannel({
        name: request.name,
        description: request.description,
        type: request.type,
        ownerId: request.ownerId,
        members: request.members
      });

      // 관련 캐시 무효화
      this.invalidateChannelCache(request.ownerId);

      return {
        channel: this.mapToChannelProfile(channel),
        success: true,
        createdAt: new Date()
      };
    } catch (error) {
      return {
        channel: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        createdAt: new Date()
      };
    }
  }

  /**
   * 채널 조회 - 캐싱 적용
   */
  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('channel', 'info', request.id);
      const cached = await this.getCached<GetChannelResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const channel = await this.channelService.getChannel(request.id);

      // 응답 구성
      const response: GetChannelResponse = {
        channel: this.mapToChannelProfile(channel),
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('channel_info'));

      return response;
    } catch (error) {
      return {
        channel: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 사용자 채널 목록 조회 - 캐싱 적용
   */
  async getChannels(request: GetChannelsRequest): Promise<GetChannelsResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('channel', 'list', request.userId);
      const cached = await this.getCached<GetChannelsResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const channels = await this.channelService.getUserChannels(request.userId);

      // 응답 구성
      const response: GetChannelsResponse = {
        channels: channels.map(channel => this.mapToChannelProfile(channel)),
        success: true,
        cached: false,
        total: channels.length,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('channel_list'));

      return response;
    } catch (error) {
      return {
        channels: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        total: 0,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 채널 업데이트 - 캐시 무효화
   */
  async updateChannel(request: UpdateChannelRequest): Promise<UpdateChannelResponse> {
    try {
      // 권한 검증
      await this.checkChannelPermissions(request.userId, 'update_channel');

      // Base Service 호출
      const updatedChannel = await this.channelService.updateChannel(request.id, request.updates);

      // 관련 캐시 무효화
      this.invalidateChannelCache(request.id);

      return {
        channel: this.mapToChannelProfile(updatedChannel),
        success: true,
        updatedAt: new Date()
      };
    } catch (error) {
      return {
        channel: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date()
      };
    }
  }

  /**
   * 멤버 추가 - 캐시 무효화
   */
  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    try {
      // 권한 검증
      await this.checkChannelPermissions(request.userId, 'add_member');

      // Base Service 호출
      const result = await this.channelService.addMember(request.channelId, request.memberId);

      if (result) {
        // 관련 캐시 무효화
        this.invalidateMemberCache(request.channelId);
        this.invalidateChannelCache(request.channelId);

        return {
          success: true,
          message: 'Member added successfully'
        };
      } else {
        return {
          success: false,
          error: 'Failed to add member'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 멤버 제거 - 캐시 무효화
   */
  async removeMember(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    try {
      // 권한 검증
      await this.checkChannelPermissions(request.userId, 'remove_member');

      // Base Service 호출
      const result = await this.channelService.removeMember(request.channelId, request.memberId);

      if (result) {
        // 관련 캐시 무효화
        this.invalidateMemberCache(request.channelId);
        this.invalidateChannelCache(request.channelId);

        return {
          success: true,
          message: 'Member removed successfully'
        };
      } else {
        return {
          success: false,
          error: 'Failed to remove member'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 채널 삭제 - 캐시 무효화
   */
  async deleteChannel(channelId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 권한 검증
      await this.checkChannelPermissions(userId, 'delete_channel');

      // Base Service 호출
      const result = await this.channelService.deleteChannel(channelId, userId);

      if (result) {
        // 관련 캐시 무효화
        this.invalidateChannelCache(channelId);
        this.invalidateChannelListCache();

        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete channel' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 채널 검색 - 캐싱 적용
   */
  async searchChannels(query: string, userId?: string, limit: number = 10): Promise<any[]> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('channel', 'search', query, userId || 'all', limit);
      const cached = await this.getCached<any[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // Base Service 호출
      const channels = await this.channelService.searchChannels(query, userId, limit);

      // 캐시 저장
      await this.setCached(cacheKey, channels, this.calculateTTL('search_results'));

      return channels;
    } catch (error) {
      return [];
    }
  }

  /**
   * 채널 통계 조회 - 캐싱 적용
   */
  async getChannelStats(channelId: string): Promise<any> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('channel', 'stats', channelId);
      const cached = await this.getCached<any>(cacheKey);
      if (cached) {
        return cached;
      }

      // Base Service 호출
      const stats = await this.channelService.getChannelStats(channelId);

      // 캐시 저장
      await this.setCached(cacheKey, stats, this.calculateTTL('channel_info'));

      return stats;
    } catch (error) {
      return null;
    }
  }

  /**
   * 멤버 여부 확인
   */
  async isMember(channelId: string, userId: string): Promise<boolean> {
    return await this.channelService.isMember(channelId, userId);
  }

  /**
   * 채널 권한 검증
   */
  private async checkChannelPermissions(userId: string, operation: string): Promise<boolean> {
    const hasPermission = await this.userService.hasPermission(userId, operation);
    if (!hasPermission) {
      throw new Error(`User ${userId} does not have permission for ${operation}`);
    }
    return true;
  }

  /**
   * 채널 관련 캐시 무효화
   */
  private invalidateChannelCache(channelId: string): void {
    this.invalidateCachePattern(`channel:${channelId}`);
    this.invalidateCachePattern(`channel:info:${channelId}`);
    this.invalidateCachePattern(`channel:stats:${channelId}`);
  }

  /**
   * 멤버 관련 캐시 무효화
   */
  private invalidateMemberCache(channelId: string): void {
    this.invalidateCachePattern(`channel:${channelId}:members`);
  }

  /**
   * 채널 목록 캐시 무효화
   */
  private invalidateChannelListCache(): void {
    this.invalidateCachePattern('channel:list');
  }

  /**
   * 채널 엔티티를 DTO로 변환
   */
  private mapToChannelProfile(channel: any): any {
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description || '',
      type: channel.type,
      ownerId: channel.ownerId,
      memberCount: channel.members?.length || 0,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt
    };
  }
} 