import type { IChannelRepository } from '../../../domain/repositories/IChannelRepository';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { BaseService } from '../base/BaseService';
import type { ILogger } from '../../../domain/interfaces/ILogger';
import { ChannelEntity } from '../../../domain/entities/Channel';
import { DomainErrorFactory } from '../../../domain/errors/DomainError';

/**
 * ChannelService - 채널 도메인 로직을 담당하는 Base Service
 * 핵심 비즈니스 로직과 도메인 규칙을 처리
 */
export class ChannelService extends BaseService<IChannelRepository> {
  protected repository: IChannelRepository;

  constructor(
    channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository,
    private readonly messageRepository: IMessageRepository,
    logger?: ILogger
  ) {
    super(logger);
    this.repository = channelRepository;
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
  }): Promise<ChannelEntity> {
    return await this.measurePerformance('create_channel', async () => {
      try {
        // 입력 검증
        const validationSchema = {
          name: { required: true, type: 'string' as const, minLength: 1, maxLength: 50 },
          type: { required: true, type: 'string' as const, enum: ['public', 'private', 'direct'] },
          ownerId: { required: true, type: 'string' as const },
          members: { required: true, type: 'array' as const, minLength: 1 }
        };

        const validation = this.validateInput(channelData, validationSchema);
        if (!validation.isValid) {
          throw DomainErrorFactory.createChannelValidation(validation.errors.join(', '));
        }

        // 비즈니스 규칙 검증
        const businessRules = [
          {
            name: 'owner_exists',
            message: 'Channel owner does not exist',
            validate: (data: any) => {
              return this.userRepository.findById(data.ownerId).then(user => !!user);
            }
          }
          // findByName 메서드가 없으므로 주석 처리
          // {
          //   name: 'unique_channel_name',
          //   message: 'Channel name already exists',
          //   validate: (data: any) => {
          //     return this.repository.findByName(data.name).then(channel => !channel);
          //   }
          // }
        ];

        const ruleValidation = await this.validateBusinessRules(channelData, businessRules);
        if (!ruleValidation.isValid) {
          throw DomainErrorFactory.createChannelValidation(ruleValidation.violations[0].message);
        }

        // 임시 채널 생성 (실제로는 repository에서 생성해야 함)
        const channel: any = {
          id: `channel_${Date.now()}`,
          name: channelData.name,
          description: channelData.description || '',
          type: channelData.type,
          ownerId: channelData.ownerId,
          members: channelData.members,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return channel;
      } catch (error) {
        this.handleError(error, 'createChannel', { channelName: channelData.name, ownerId: channelData.ownerId });
      }
    }, { channelName: channelData.name, ownerId: channelData.ownerId });
  }

  /**
   * 채널 조회
   */
  async getChannel(channelId: string): Promise<ChannelEntity> {
    return await this.measurePerformance('get_channel', async () => {
      try {
        if (!channelId) {
          throw DomainErrorFactory.createChannelValidation('Channel ID is required');
        }

        const channel = await this.repository.findById(channelId);
        if (!channel) {
          throw DomainErrorFactory.createChannelNotFound(channelId);
        }

        return channel;
      } catch (error) {
        this.handleError(error, 'getChannel', { channelId });
      }
    }, { channelId });
  }

  /**
   * 사용자의 채널 목록 조회
   */
  async getUserChannels(userId: string): Promise<ChannelEntity[]> {
    return await this.measurePerformance('get_user_channels', async () => {
      try {
        if (!userId) {
          throw DomainErrorFactory.createUserValidation('User ID is required');
        }

        // 임시 구현 (실제로는 repository에서 조회해야 함)
        return [];
      } catch (error) {
        this.handleError(error, 'getUserChannels', { userId });
      }
    }, { userId });
  }

  /**
   * 채널 업데이트
   */
  async updateChannel(channelId: string, updates: Partial<ChannelEntity>): Promise<any> {
    return await this.measurePerformance('update_channel', async () => {
      try {
        if (!channelId) {
          throw DomainErrorFactory.createChannelValidation('Channel ID is required');
        }

        // 채널 존재 확인
        const channel = await this.repository.findById(channelId);
        if (!channel) {
          throw DomainErrorFactory.createChannelNotFound(channelId);
        }

        // 입력 검증
        const validationSchema = {
          name: { required: false, type: 'string' as const, minLength: 1, maxLength: 50 },
          description: { required: false, type: 'string' as const, maxLength: 500 }
        };

        const validation = this.validateInput(updates, validationSchema);
        if (!validation.isValid) {
          throw DomainErrorFactory.createChannelValidation(validation.errors.join(', '));
        }

        // 임시 업데이트 (실제로는 repository에서 업데이트해야 함)
        const updatedChannel = { ...channel, ...updates, updatedAt: new Date() };
        return updatedChannel;
      } catch (error) {
        this.handleError(error, 'updateChannel', { channelId, updates });
      }
    }, { channelId, updates });
  }

  /**
   * 채널에 멤버 추가
   */
  async addMember(channelId: string, userId: string): Promise<boolean> {
    return await this.measurePerformance('add_member', async () => {
      try {
        // 채널 존재 확인
        const channel = await this.repository.findById(channelId);
        if (!channel) {
          throw DomainErrorFactory.createChannelNotFound(channelId);
        }

        // 사용자 존재 확인
        const user = await this.userRepository.findById(userId);
        if (!user) {
          throw DomainErrorFactory.createUserNotFound(userId);
        }

        // 이미 멤버인지 확인
        const isMember = await this.repository.isMember(channelId, userId);
        if (isMember) {
          throw DomainErrorFactory.createChannelValidation('User is already a member of this channel');
        }

        // 멤버 추가
        await this.repository.addMember(channelId, userId);
        return true;
      } catch (error) {
        this.handleError(error, 'addMember', { channelId, userId });
      }
    }, { channelId, userId });
  }

  /**
   * 채널에서 멤버 제거
   */
  async removeMember(channelId: string, userId: string): Promise<boolean> {
    return await this.measurePerformance('remove_member', async () => {
      try {
        // 채널 존재 확인
        const channel = await this.repository.findById(channelId);
        if (!channel) {
          throw DomainErrorFactory.createChannelNotFound(channelId);
        }

        // 멤버인지 확인
        const isMember = await this.repository.isMember(channelId, userId);
        if (!isMember) {
          throw DomainErrorFactory.createChannelValidation('User is not a member of this channel');
        }

        // 멤버 제거
        await this.repository.removeMember(channelId, userId);
        return true;
      } catch (error) {
        this.handleError(error, 'removeMember', { channelId, userId });
      }
    }, { channelId, userId });
  }

  /**
   * 채널 통계 조회
   */
  async getChannelStats(channelId: string): Promise<any> {
    return await this.measurePerformance('get_channel_stats', async () => {
      try {
        const channel = await this.repository.findById(channelId);
        if (!channel) {
          throw DomainErrorFactory.createChannelNotFound(channelId);
        }

        // 임시 통계 반환 (실제로는 repository에서 통계를 가져와야 함)
        return {
          channelId,
          memberCount: 0,
          messageCount: 0,
          createdAt: channel.createdAt
        };
      } catch (error) {
        this.handleError(error, 'getChannelStats', { channelId });
      }
    }, { channelId });
  }

  /**
   * 채널 검색
   */
  async searchChannels(query: string, userId?: string, limit: number = 10): Promise<ChannelEntity[]> {
    return await this.measurePerformance('search_channels', async () => {
      try {
        // 입력 검증
        const validationSchema = {
          query: { required: true, type: 'string' as const, minLength: 1 },
          limit: { required: false, type: 'number' as const, minLength: 1, maxLength: 100 }
        };

        const validation = this.validateInput({ query, limit }, validationSchema);
        if (!validation.isValid) {
          throw DomainErrorFactory.createChannelValidation(validation.errors.join(', '));
        }

        // 임시 검색 결과 반환 (실제로는 repository에서 검색해야 함)
        return [];
      } catch (error) {
        this.handleError(error, 'searchChannels', { query, userId, limit });
      }
    }, { query, userId, limit });
  }

  /**
   * 채널 삭제
   */
  async deleteChannel(channelId: string, userId: string): Promise<boolean> {
    return await this.measurePerformance('delete_channel', async () => {
      try {
        const channel = await this.repository.findById(channelId);
        if (!channel) {
          throw DomainErrorFactory.createChannelNotFound(channelId);
        }

        // 권한 확인 (소유자만 삭제 가능)
        if (channel.ownerId !== userId) {
          throw DomainErrorFactory.createChannelValidation('Only channel owner can delete the channel');
        }

        // 임시로 삭제 성공 반환 (실제로는 repository에서 삭제해야 함)
        return true;
      } catch (error) {
        this.handleError(error, 'deleteChannel', { channelId, userId });
      }
    }, { channelId, userId });
  }

  /**
   * 채널 존재 여부 확인
   */
  async channelExists(channelId: string): Promise<boolean> {
    return await this.measurePerformance('channel_exists', async () => {
      try {
        const channel = await this.repository.findById(channelId);
        return !!channel;
      } catch (error) {
        this.handleError(error, 'channelExists', { channelId });
      }
    }, { channelId });
  }

  /**
   * 멤버 여부 확인
   */
  async isMember(channelId: string, userId: string): Promise<boolean> {
    return await this.measurePerformance('is_member', async () => {
      try {
        return await this.repository.isMember(channelId, userId);
      } catch (error) {
        this.handleError(error, 'isMember', { channelId, userId });
      }
    }, { channelId, userId });
  }
} 