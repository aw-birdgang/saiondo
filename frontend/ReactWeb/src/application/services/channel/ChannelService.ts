import type { ILogger } from '../../../domain/interfaces/ILogger';
import { BaseService } from '../base/BaseService';
import { ChannelEntity } from '../../../domain/entities/Channel';

/**
 * Channel Service - 핵심 채널 로직
 * BaseService를 상속받아 공통 기능 활용
 */
export class ChannelService extends BaseService<any> {
  protected repository: any;

  constructor(
    channelRepository: any,
    private readonly userRepository: any,
    private readonly messageRepository: any,
    logger?: ILogger
  ) {
    super(logger);
    this.repository = channelRepository;
  }

  /**
   * 채널 생성 - 핵심 로직
   */
  async createChannel(channelData: {
    name: string;
    description?: string;
    type: 'public' | 'private' | 'direct';
    ownerId: string;
    members: string[];
  }): Promise<ChannelEntity> {
    return this.measurePerformance('create_channel', async () => {
      // 기본 검증
      if (!channelData.name || channelData.name.trim().length === 0) {
        throw new Error('Channel name is required');
      }

      if (channelData.name.length > 50) {
        throw new Error('Channel name must be at most 50 characters');
      }

      // Repository를 통한 채널 생성
      const channel = await this.repository.createChannel(channelData);

      this.logger?.info('Channel created successfully', {
        channelId: channel.id,
        channelName: channel.name,
        ownerId: channel.ownerId
      });

      return channel;
    }, { channelName: channelData.name, ownerId: channelData.ownerId });
  }

  /**
   * 채널 조회 - 핵심 로직
   */
  async getChannel(channelId: string): Promise<ChannelEntity> {
    return this.measurePerformance('get_channel', async () => {
      if (!channelId) {
        throw new Error('Channel ID is required');
      }

      const channel = await this.repository.getChannel(channelId);
      if (!channel) {
        throw new Error('Channel not found');
      }

      return channel;
    }, { channelId });
  }

  /**
   * 사용자의 채널 목록 조회 - 핵심 로직
   */
  async getUserChannels(userId: string): Promise<ChannelEntity[]> {
    return this.measurePerformance('get_user_channels', async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      return await this.repository.getUserChannels(userId);
    }, { userId });
  }

  /**
   * 채널 업데이트 - 핵심 로직
   */
  async updateChannel(channelId: string, updates: any): Promise<ChannelEntity> {
    return this.measurePerformance('update_channel', async () => {
      if (!channelId) {
        throw new Error('Channel ID is required');
      }

      // 채널 존재 확인
      const channelExists = await this.repository.channelExists(channelId);
      if (!channelExists) {
        throw new Error('Channel not found');
      }

      return await this.repository.updateChannel(channelId, updates);
    }, { channelId, updates });
  }

  /**
   * 멤버 추가 - 핵심 로직
   */
  async addMember(channelId: string, userId: string): Promise<boolean> {
    return this.measurePerformance('add_member', async () => {
      if (!channelId || !userId) {
        throw new Error('Channel ID and User ID are required');
      }

      // 채널 존재 확인
      const channelExists = await this.repository.channelExists(channelId);
      if (!channelExists) {
        throw new Error('Channel not found');
      }

      // 이미 멤버인지 확인
      const isAlreadyMember = await this.repository.isMember(channelId, userId);
      if (isAlreadyMember) {
        throw new Error('User is already a member of this channel');
      }

      return await this.repository.addMember(channelId, userId);
    }, { channelId, userId });
  }

  /**
   * 멤버 제거 - 핵심 로직
   */
  async removeMember(channelId: string, userId: string): Promise<boolean> {
    return this.measurePerformance('remove_member', async () => {
      if (!channelId || !userId) {
        throw new Error('Channel ID and User ID are required');
      }

      // 채널 존재 확인
      const channelExists = await this.repository.channelExists(channelId);
      if (!channelExists) {
        throw new Error('Channel not found');
      }

      // 멤버인지 확인
      const isMember = await this.repository.isMember(channelId, userId);
      if (!isMember) {
        throw new Error('User is not a member of this channel');
      }

      return await this.repository.removeMember(channelId, userId);
    }, { channelId, userId });
  }

  /**
   * 채널 통계 조회 - 핵심 로직
   */
  async getChannelStats(channelId: string): Promise<any> {
    return this.measurePerformance('get_channel_stats', async () => {
      if (!channelId) {
        throw new Error('Channel ID is required');
      }

      // 채널 존재 확인
      const channelExists = await this.repository.channelExists(channelId);
      if (!channelExists) {
        throw new Error('Channel not found');
      }

      return await this.repository.getChannelStats(channelId);
    }, { channelId });
  }

  /**
   * 채널 검색 - 핵심 로직
   */
  async searchChannels(query: string, userId?: string, limit: number = 10): Promise<ChannelEntity[]> {
    return this.measurePerformance('search_channels', async () => {
      if (!query || query.trim().length === 0) {
        throw new Error('Search query is required');
      }

      if (limit < 1 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }

      return await this.repository.searchChannels(query, userId, limit);
    }, { query, userId, limit });
  }

  /**
   * 채널 삭제 - 핵심 로직
   */
  async deleteChannel(channelId: string, userId: string): Promise<boolean> {
    return this.measurePerformance('delete_channel', async () => {
      if (!channelId || !userId) {
        throw new Error('Channel ID and User ID are required');
      }

      // 채널 존재 확인
      const channel = await this.repository.getChannel(channelId);
      if (!channel) {
        throw new Error('Channel not found');
      }

      // 소유자 확인
      if (channel.ownerId !== userId) {
        throw new Error('Only channel owner can delete the channel');
      }

      return await this.repository.deleteChannel(channelId);
    }, { channelId, userId });
  }

  /**
   * 채널 존재 확인 - 핵심 로직
   */
  async channelExists(channelId: string): Promise<boolean> {
    return this.measurePerformance('channel_exists', async () => {
      if (!channelId) {
        return false;
      }

      return await this.repository.channelExists(channelId);
    }, { channelId });
  }

  /**
   * 멤버 여부 확인 - 핵심 로직
   */
  async isMember(channelId: string, userId: string): Promise<boolean> {
    return this.measurePerformance('is_member', async () => {
      if (!channelId || !userId) {
        return false;
      }

      return await this.repository.isMember(channelId, userId);
    }, { channelId, userId });
  }

  // UseCase Service에서 사용할 수 있는 기본 메서드들
  async getBasicChannel(channelId: string): Promise<ChannelEntity> {
    return await this.repository.getChannel(channelId);
  }

  async getBasicUserChannels(userId: string): Promise<ChannelEntity[]> {
    return await this.repository.getUserChannels(userId);
  }

  async addMemberToChannel(channelId: string, userId: string): Promise<boolean> {
    return await this.repository.addMember(channelId, userId);
  }
} 