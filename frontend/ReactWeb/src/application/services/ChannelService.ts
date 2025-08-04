import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { ChannelEntity } from '../../domain/entities/Channel';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import { PerformanceMonitoringService } from './PerformanceMonitoringService';
import { ErrorHandlingService } from './ErrorHandlingService';
import { SecurityService } from './SecurityService';

export interface ChannelProfile {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  ownerId: string;
  members: string[];
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
}

export interface ChannelStats {
  totalMessages: number;
  activeMembers: number;
  lastActivity: Date;
  messageCount: number;
}

export interface ChannelValidationSchema {
  name: { required: boolean; type: string; minLength: number; maxLength: number; pattern?: RegExp };
  description?: { required: boolean; type: string; maxLength: number };
  type: { required: boolean; type: string; enum: string[] };
  ownerId: { required: boolean; type: string };
  members: { required: boolean; type: string; minLength: number };
}

export interface ChannelServiceConfig {
  enableValidation?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableSecurityChecks?: boolean;
  maxChannelNameLength?: number;
  minChannelNameLength?: number;
  maxDescriptionLength?: number;
  maxMembersPerChannel?: number;
}

export class ChannelService {
  private readonly performanceService: PerformanceMonitoringService;
  private readonly errorService: ErrorHandlingService;
  private readonly securityService: SecurityService;

  constructor(
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly config: ChannelServiceConfig = {}
  ) {
    this.performanceService = new PerformanceMonitoringService(
      userRepository,
      channelRepository,
      messageRepository
    );
    
    this.errorService = new ErrorHandlingService({
      enableConsoleLogging: true,
      enableRemoteLogging: false,
    });
    
    this.securityService = new SecurityService({
      enableInputValidation: config.enableValidation ?? true,
      enableXSSProtection: true,
    });
  }

  /**
   * 채널 생성
   */
  async createChannel(channelData: {
    name: string;
    description?: string;
    type: 'public' | 'private' | 'direct';
    ownerId: string;
    members: string[];
  }): Promise<ChannelProfile> {
    return await this.performanceService.measurePerformance(
      'create_channel',
      async () => {
        try {
          // 입력 검증
          if (this.config.enableValidation) {
            const validationSchema: ChannelValidationSchema = {
              name: { 
                required: true, 
                type: 'string', 
                minLength: this.config.minChannelNameLength || 1, 
                maxLength: this.config.maxChannelNameLength || 50,
                pattern: /^[a-zA-Z0-9\s\-_]+$/
              },
              description: { 
                required: false, 
                type: 'string', 
                maxLength: this.config.maxDescriptionLength || 200
              },
              type: { 
                required: true, 
                type: 'string', 
                enum: ['public', 'private', 'direct']
              },
              ownerId: { 
                required: true, 
                type: 'string'
              },
              members: { 
                required: true, 
                type: 'string', 
                minLength: 1
              }
            };

            const validation = this.securityService.validateInput(channelData, validationSchema);
            if (!validation.isValid) {
              throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }
          }

          // 비즈니스 규칙 검증
          if (!channelData.name || channelData.name.trim().length === 0) {
            throw DomainErrorFactory.createChannelValidation('Channel name is required');
          }

          if (channelData.name.length > (this.config.maxChannelNameLength || 50)) {
            throw DomainErrorFactory.createChannelValidation('Channel name must be less than 50 characters');
          }

          if (!channelData.ownerId || channelData.ownerId.trim().length === 0) {
            throw DomainErrorFactory.createChannelValidation('Channel owner is required');
          }

          if (!channelData.members.includes(channelData.ownerId)) {
            throw DomainErrorFactory.createChannelValidation('Channel owner must be a member');
          }

          if (channelData.type === 'direct' && channelData.members.length !== 2) {
            throw DomainErrorFactory.createChannelValidation('Direct channels must have exactly 2 members');
          }

          // 최대 멤버 수 제한
          if (this.config.maxMembersPerChannel && channelData.members.length > this.config.maxMembersPerChannel) {
            throw DomainErrorFactory.createChannelValidation(`Channel cannot have more than ${this.config.maxMembersPerChannel} members`);
          }

          // 채널 엔티티 생성
          const channelEntity = ChannelEntity.create({
            name: channelData.name,
            description: channelData.description,
            type: channelData.type,
            ownerId: channelData.ownerId,
            members: channelData.members,
          });

          // 저장
          const savedChannel = await this.channelRepository.save(channelEntity);

          return this.mapToChannelProfile(savedChannel);
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.createChannel',
            channelData
          });
          throw error;
        }
      },
      { channelType: channelData.type, memberCount: channelData.members.length }
    );
  }

  /**
   * 채널 조회
   */
  async getChannel(channelId: string): Promise<ChannelProfile> {
    return await this.performanceService.measurePerformance(
      'get_channel',
      async () => {
        try {
          const channel = await this.channelRepository.findById(channelId);

          if (!channel) {
            throw DomainErrorFactory.createChannelNotFound(channelId);
          }

          return this.mapToChannelProfile(channel);
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.getChannel',
            channelId
          });
          throw error;
        }
      },
      { channelId }
    );
  }

  /**
   * 사용자가 속한 채널 목록 조회
   */
  async getUserChannels(userId: string): Promise<ChannelProfile[]> {
    return await this.performanceService.measurePerformance(
      'get_user_channels',
      async () => {
        try {
          const channels = await this.channelRepository.findByUserId(userId);
          return channels.map(channel => this.mapToChannelProfile(channel));
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.getUserChannels',
            userId
          });
          throw error;
        }
      },
      { userId }
    );
  }

  /**
   * 채널 업데이트
   */
  async updateChannel(channelId: string, updates: Partial<ChannelProfile>): Promise<ChannelProfile> {
    return await this.performanceService.measurePerformance(
      'update_channel',
      async () => {
        try {
          // 입력 검증
          if (this.config.enableValidation && updates.name) {
            const sanitizedName = this.securityService.sanitizeInput(updates.name);
            if (sanitizedName.length < (this.config.minChannelNameLength || 1)) {
              throw new Error('Channel name is too short');
            }
            if (sanitizedName.length > (this.config.maxChannelNameLength || 50)) {
              throw new Error('Channel name is too long');
            }
          }

          const existingChannel = await this.channelRepository.findById(channelId);

          if (!existingChannel) {
            throw DomainErrorFactory.createChannelNotFound(channelId);
          }

          // 업데이트 적용
          const updatedChannel = await this.channelRepository.update(channelId, updates);

          return this.mapToChannelProfile(updatedChannel);
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.updateChannel',
            channelId,
            updates
          });
          throw error;
        }
      },
      { channelId, updateFields: Object.keys(updates) }
    );
  }

  /**
   * 채널 멤버 추가
   */
  async addMember(channelId: string, userId: string): Promise<ChannelProfile> {
    return await this.performanceService.measurePerformance(
      'add_channel_member',
      async () => {
        try {
          const channel = await this.channelRepository.findById(channelId);

          if (!channel) {
            throw DomainErrorFactory.createChannelNotFound(channelId);
          }

          // 사용자 존재 확인
          const user = await this.userRepository.findById(userId);
          if (!user) {
            throw DomainErrorFactory.createUserNotFound(userId);
          }

          // 이미 멤버인지 확인
          if (channel.members.includes(userId)) {
            throw new Error('User is already a member of this channel');
          }

          // 최대 멤버 수 제한 확인
          if (this.config.maxMembersPerChannel && channel.members.length >= this.config.maxMembersPerChannel) {
            throw new Error(`Channel cannot have more than ${this.config.maxMembersPerChannel} members`);
          }

          // 멤버 추가
          const updatedMembers = [...channel.members, userId];
          const updatedChannel = await this.channelRepository.update(channelId, {
            members: updatedMembers
          });

          return this.mapToChannelProfile(updatedChannel);
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.addMember',
            channelId,
            userId
          });
          throw error;
        }
      },
      { channelId, userId }
    );
  }

  /**
   * 채널 멤버 제거
   */
  async removeMember(channelId: string, userId: string): Promise<ChannelProfile> {
    return await this.performanceService.measurePerformance(
      'remove_channel_member',
      async () => {
        try {
          const channel = await this.channelRepository.findById(channelId);

          if (!channel) {
            throw DomainErrorFactory.createChannelNotFound(channelId);
          }

          // 소유자는 제거할 수 없음
          if (channel.ownerId === userId) {
            throw new Error('Cannot remove channel owner');
          }

          // 멤버가 아닌 경우
          if (!channel.members.includes(userId)) {
            throw new Error('User is not a member of this channel');
          }

          // 멤버 제거
          const updatedMembers = channel.members.filter(memberId => memberId !== userId);
          const updatedChannel = await this.channelRepository.update(channelId, {
            members: updatedMembers
          });

          return this.mapToChannelProfile(updatedChannel);
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.removeMember',
            channelId,
            userId
          });
          throw error;
        }
      },
      { channelId, userId }
    );
  }

  /**
   * 채널 통계 조회
   */
  async getChannelStats(channelId: string): Promise<ChannelStats> {
    return await this.performanceService.measurePerformance(
      'get_channel_stats',
      async () => {
        try {
          const channel = await this.channelRepository.findById(channelId);

          if (!channel) {
            throw DomainErrorFactory.createChannelNotFound(channelId);
          }

          // 채널의 메시지 수 조회
          const messages = await this.messageRepository.findByChannelId(channelId);
          const totalMessages = messages.length;

          // 활성 멤버 수 계산 (최근 7일 내 활동)
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const activeMembers = channel.members.length; // 실제로는 사용자 활동 기반으로 계산

          // 마지막 활동 시간
          const lastActivity = channel.updatedAt;

          return {
            totalMessages,
            activeMembers,
            lastActivity,
            messageCount: totalMessages
          };
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.getChannelStats',
            channelId
          });
          throw error;
        }
      },
      { channelId }
    );
  }

  /**
   * 채널 검색
   */
  async searchChannels(query: string, userId?: string, limit: number = 10): Promise<ChannelProfile[]> {
    return await this.performanceService.measurePerformance(
      'search_channels',
      async () => {
        try {
          // 입력 검증
          if (this.config.enableValidation) {
            const sanitizedQuery = this.securityService.sanitizeInput(query);
            if (sanitizedQuery.length < 2) {
              throw new Error('Search query must be at least 2 characters long');
            }
          }

          const channels = await this.channelRepository.search(query, userId, limit);
          return channels.map(channel => this.mapToChannelProfile(channel));
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.searchChannels',
            query,
            userId,
            limit
          });
          throw error;
        }
      },
      { query, userId, limit }
    );
  }

  /**
   * 채널 삭제
   */
  async deleteChannel(channelId: string, userId: string): Promise<boolean> {
    return await this.performanceService.measurePerformance(
      'delete_channel',
      async () => {
        try {
          const channel = await this.channelRepository.findById(channelId);

          if (!channel) {
            throw DomainErrorFactory.createChannelNotFound(channelId);
          }

          // 소유자만 삭제 가능
          if (channel.ownerId !== userId) {
            throw new Error('Only channel owner can delete the channel');
          }

          await this.channelRepository.delete(channelId);
          return true;
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.deleteChannel',
            channelId,
            userId
          });
          throw error;
        }
      },
      { channelId, userId }
    );
  }

  /**
   * 채널 존재 여부 확인
   */
  async channelExists(channelId: string): Promise<boolean> {
    try {
      const channel = await this.channelRepository.findById(channelId);
      return !!channel;
    } catch (error) {
      this.errorService.logError(error, { 
        context: 'ChannelService.channelExists',
        channelId
      });
      return false;
    }
  }

  /**
   * 사용자가 채널의 멤버인지 확인
   */
  async isMember(channelId: string, userId: string): Promise<boolean> {
    return await this.performanceService.measurePerformance(
      'check_channel_membership',
      async () => {
        try {
          const channel = await this.channelRepository.findById(channelId);

          if (!channel) {
            return false;
          }

          return channel.members.includes(userId);
        } catch (error) {
          this.errorService.logError(error, { 
            context: 'ChannelService.isMember',
            channelId,
            userId
          });
          return false;
        }
      },
      { channelId, userId }
    );
  }

  /**
   * 채널 엔티티를 ChannelProfile로 변환
   */
  private mapToChannelProfile(channel: any): ChannelProfile {
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description,
      type: channel.type,
      ownerId: channel.ownerId,
      members: channel.members,
      memberCount: channel.members.length,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      lastMessageAt: channel.lastMessageAt
    };
  }
} 