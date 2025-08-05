import type { ILogger } from '../../../../domain/interfaces/ILogger';
import { BaseCacheService, type ICache } from '../../../services/base/BaseCacheService';
import { ChannelService } from '../../../services/channel/ChannelService';
import { ChannelEntity } from '../../../../domain/entities/Channel';
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
 * Channel UseCase Service - UseCase별 특화된 채널 로직
 * BaseCacheService를 상속받아 캐싱 기능 활용
 */
export class ChannelUseCaseService extends BaseCacheService {
  constructor(
    private readonly channelService: ChannelService,
    private readonly userService: any,
    cache?: ICache,
    logger?: ILogger
  ) {
    super(cache, logger);
  }

  /**
   * 채널 생성 - UseCase 특화 로직
   */
  async createChannel(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    try {
      // 권한 검증
      const hasPermission = await this.checkChannelPermissions(request.ownerId, '', 'create_channel');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to create channel');
      }

      // Base Service 사용
      const channel = await this.channelService.createChannel({
        name: request.name,
        description: request.description,
        type: request.type,
        ownerId: request.ownerId,
        members: request.members
      });

      // 캐시 무효화
      this.invalidateChannelCache(request.ownerId);

      const response: CreateChannelResponse = {
        channel: this.mapToChannelProfile(channel),
        success: true,
        createdAt: new Date()
      };

      return response;
    } catch (error) {
      this.logger?.error('Failed to create channel', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to create channel: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 채널 조회 - UseCase 특화 로직
   */
  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('channel', request.id);
      const cached = await this.getCached<GetChannelResponse>(cacheKey, this.calculateTTL('channel_info'));
      if (cached) {
        this.logger?.debug('Returning cached channel', { cacheKey });
        return cached;
      }

      // Base Service 사용
      const channel = await this.channelService.getChannel(request.id);

      const response: GetChannelResponse = {
        channel: this.mapToChannelProfile(channel),
        success: true,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('channel_info'));

      return response;
    } catch (error) {
      this.logger?.error('Failed to get channel', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to get channel: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 사용자의 채널 목록 조회 - UseCase 특화 로직
   */
  async getChannels(request: GetChannelsRequest): Promise<GetChannelsResponse> {
    try {
      if (!request.userId) {
        throw new Error('User ID is required');
      }

      // 캐시 확인
      const cacheKey = this.generateCacheKey('channels', request.userId);
      const cached = await this.getCached<GetChannelsResponse>(cacheKey, this.calculateTTL('channel_list'));
      if (cached) {
        this.logger?.debug('Returning cached channels', { cacheKey });
        return cached;
      }

      // Base Service 사용
      const channels = await this.channelService.getUserChannels(request.userId);

      const response: GetChannelsResponse = {
        channels: channels.map(channel => this.mapToChannelProfile(channel)),
        success: true,
        fetchedAt: new Date(),
        totalCount: channels.length,
        total: channels.length,
        hasMore: false
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('channel_list'));

      return response;
    } catch (error) {
      this.logger?.error('Failed to get channels', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to get channels: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 채널 업데이트 - UseCase 특화 로직
   */
  async updateChannel(request: UpdateChannelRequest): Promise<UpdateChannelResponse> {
    try {
      // 권한 검증
      const hasPermission = await this.checkChannelPermissions(request.userId, request.channelId, 'update_channel');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to update channel');
      }

      // Base Service 사용
      const channel = await this.channelService.updateChannel(request.channelId, request.updates);

      // 캐시 무효화
      this.invalidateChannelCache(request.channelId);

      const response: UpdateChannelResponse = {
        channel: this.mapToChannelProfile(channel),
        success: true,
        updatedAt: new Date()
      };

      return response;
    } catch (error) {
      this.logger?.error('Failed to update channel', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to update channel: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 멤버 추가 - UseCase 특화 로직
   */
  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    try {
      // 권한 검증
      const hasPermission = await this.checkChannelPermissions(request.userId, request.channelId, 'add_member');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to add member');
      }

      // Base Service 사용
      const success = await this.channelService.addMember(request.channelId, request.memberId);

      if (success) {
        // 캐시 무효화
        this.invalidateMemberCache(request.channelId);
      }

      const response: AddMemberResponse = {
        success,
        addedAt: new Date(),
        channelId: request.channelId,
        memberId: request.memberId
      };

      return response;
    } catch (error) {
      this.logger?.error('Failed to add member', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to add member: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 멤버 제거 - UseCase 특화 로직
   */
  async removeMember(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    try {
      // 권한 검증
      const hasPermission = await this.checkChannelPermissions(request.userId, request.channelId, 'remove_member');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to remove member');
      }

      // Base Service 사용
      const success = await this.channelService.removeMember(request.channelId, request.memberId);

      if (success) {
        // 캐시 무효화
        this.invalidateMemberCache(request.channelId);
      }

      const response: RemoveMemberResponse = {
        success,
        removedAt: new Date(),
        channelId: request.channelId,
        memberId: request.memberId
      };

      return response;
    } catch (error) {
      this.logger?.error('Failed to remove member', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to remove member: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 채널 삭제 - UseCase 특화 로직
   */
  async deleteChannel(channelId: string, userId: string): Promise<boolean> {
    try {
      // 권한 검증
      const hasPermission = await this.checkChannelPermissions(userId, channelId, 'delete_channel');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to delete channel');
      }

      // Base Service 사용
      const success = await this.channelService.deleteChannel(channelId, userId);

      if (success) {
        // 캐시 무효화
        this.invalidateChannelCache(channelId);
        this.invalidateMemberCache(channelId);
      }

      return success;
    } catch (error) {
      this.logger?.error('Failed to delete channel', { 
        channelId, 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to delete channel: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 채널 멤버 목록 조회 - UseCase 특화 로직
   */
  async getChannelMembers(channelId: string): Promise<string[]> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('channel_members', channelId);
      const cached = await this.getCached<string[]>(cacheKey, this.calculateTTL('channel_info'));
      if (cached) {
        return cached;
      }

      // Base Service 사용 (간접적으로 멤버 정보 조회)
      const channel = await this.channelService.getChannel(channelId);
      const members = channel.members || [];

      // 캐시 저장
      await this.setCached(cacheKey, members, this.calculateTTL('channel_info'));

      return members;
    } catch (error) {
      this.logger?.error('Failed to get channel members', { 
        channelId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to get channel members: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 멤버 여부 확인 - UseCase 특화 로직
   */
  async isMember(channelId: string, userId: string): Promise<boolean> {
    try {
      // Base Service 사용
      return await this.channelService.isMember(channelId, userId);
    } catch (error) {
      this.logger?.error('Failed to check member status', { 
        channelId, 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      return false;
    }
  }

  /**
   * 채널 검색 - UseCase 특화 로직
   */
  async searchChannels(query: string, userId?: string, limit: number = 10): Promise<any[]> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('channel_search', query, userId || '', limit);
      const cached = await this.getCached<any[]>(cacheKey, this.calculateTTL('search_results'));
      if (cached) {
        return cached;
      }

      // Base Service 사용
      const channels = await this.channelService.searchChannels(query, userId, limit);

      // 캐시 저장
      await this.setCached(cacheKey, channels, this.calculateTTL('search_results'));

      return channels;
    } catch (error) {
      this.logger?.error('Failed to search channels', { 
        query, 
        userId, 
        limit, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to search channels: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 채널 통계 조회 - UseCase 특화 로직
   */
  async getChannelStats(channelId: string): Promise<any> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('channel_stats', channelId);
      const cached = await this.getCached<any>(cacheKey, this.calculateTTL('channel_info'));
      if (cached) {
        return cached;
      }

      // Base Service 사용
      const stats = await this.channelService.getChannelStats(channelId);

      // 캐시 저장
      await this.setCached(cacheKey, stats, this.calculateTTL('channel_info'));

      return stats;
    } catch (error) {
      this.logger?.error('Failed to get channel stats', { 
        channelId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to get channel stats: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 채널 관련 캐시 무효화
   */
  private invalidateChannelCache(channelId: string): void {
    this.invalidateCachePattern(`channel:${channelId}`);
    this.invalidateCachePattern(`channel_stats:${channelId}`);
  }

  /**
   * 멤버 관련 캐시 무효화
   */
  private invalidateMemberCache(channelId: string): void {
    this.invalidateCachePattern(`channel_members:${channelId}`);
  }

  /**
   * 권한 검증
   */
  private async checkChannelPermissions(userId: string, channelId: string, operation: string): Promise<boolean> {
    try {
      // 기본 권한 검증 로직
      // 실제 구현에서는 더 복잡한 권한 시스템을 사용해야 함
      
      if (operation === 'create_channel') {
        // 채널 생성 권한은 모든 인증된 사용자에게 허용
        return true;
      }

      if (operation === 'delete_channel') {
        // 채널 삭제는 소유자만 가능
        const channel = await this.channelService.getChannel(channelId);
        return channel.ownerId === userId;
      }

      // 기타 작업은 채널 멤버이거나 소유자인 경우 허용
      const isMember = await this.channelService.isMember(channelId, userId);
      if (isMember) {
        return true;
      }

      const channel = await this.channelService.getChannel(channelId);
      return channel.ownerId === userId;
    } catch (error) {
      this.logger?.error('Failed to check channel permissions', { 
        userId, 
        channelId, 
        operation, 
        error: error instanceof Error ? error.message : String(error) 
      });
      return false;
    }
  }

  /**
   * 채널 엔티티를 프로필로 매핑
   */
  private mapToChannelProfile(channel: ChannelEntity): any {
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description,
      type: channel.type,
      ownerId: channel.ownerId,
      members: channel.members,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt
    };
  }
} 