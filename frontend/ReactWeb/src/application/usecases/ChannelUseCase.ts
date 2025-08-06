import type { IChannelRepository } from '@/domain/repositories/IChannelRepository';
import { DomainErrorFactory } from '@/domain/errors/DomainError';
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
  RemoveMemberResponse,
} from '@/application/dto/ChannelDto';

/**
 * ChannelUseCase - 채널 관련 모든 기능을 통합한 Use Case
 * 채널 관리, 멤버 관리, 초대, 카테고리 등을 포함
 */
export class ChannelUseCase {
  constructor(
    private readonly channelRepository: IChannelRepository
  ) {}

  // ==================== 채널 관리 ====================

  /**
   * 채널 생성
   */
  async createChannel(
    request: CreateChannelRequest
  ): Promise<CreateChannelResponse> {
    try {
      // 입력 검증
      this.validateChannelRequest(request);

      // 채널 생성
      const channel = await this.channelRepository.create({
        name: request.name,
        description: request.description,
        type: request.type,
        createdBy: request.createdBy,
        isPrivate: request.isPrivate || false,
      });

      return {
        channel,
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to create channel');
    }
  }

  /**
   * 채널 조회
   */
  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    try {
      const channel = await this.channelRepository.findById(request.channelId);

      if (!channel) {
        throw DomainErrorFactory.createUserValidation('Channel not found');
      }

      return {
        channel,
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get channel');
    }
  }

  /**
   * 채널 업데이트
   */
  async updateChannel(
    request: UpdateChannelRequest
  ): Promise<UpdateChannelResponse> {
    try {
      // 입력 검증
      this.validateChannelRequest(request);

      const channel = await this.channelRepository.update(
        request.channelId,
        request.updates
      );

      return {
        channel,
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update channel');
    }
  }

  /**
   * 채널 삭제
   */
  async deleteChannel(channelId: string): Promise<boolean> {
    try {
      await this.channelRepository.delete(channelId);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to delete channel');
    }
  }

  /**
   * 사용자 채널 목록 조회
   */
  async getChannels(request: GetChannelsRequest): Promise<GetChannelsResponse> {
    try {
      const channels = await this.channelRepository.findByUser(request.userId);
      const total = channels.length;
      const limit = request.limit || 10;
      const offset = request.offset || 0;
      const paginatedChannels = channels.slice(offset, offset + limit);

      return {
        channels: paginatedChannels,
        total,
        hasMore: total > offset + limit,
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get channels');
    }
  }

  // ==================== 멤버 관리 ====================

  /**
   * 멤버 추가
   */
  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    try {
      await this.channelRepository.addMember(
        request.channelId,
        request.userId
      );

      return {
        success: true,
        message: 'Member added successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to add member');
    }
  }

  /**
   * 멤버 제거
   */
  async removeMember(
    request: RemoveMemberRequest
  ): Promise<RemoveMemberResponse> {
    try {
      await this.channelRepository.removeMember(
        request.channelId,
        request.userId
      );

      return {
        success: true,
        message: 'Member removed successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to remove member');
    }
  }

  /**
   * 채널 멤버 목록 조회
   */
  async getChannelMembers(channelId: string): Promise<string[]> {
    try {
      return await this.channelRepository.getMembers(channelId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get channel members');
    }
  }

  /**
   * 멤버 여부 확인
   */
  async isMember(channelId: string, userId: string): Promise<boolean> {
    try {
      const members = await this.channelRepository.getMembers(channelId);
      return members.includes(userId);
    } catch (error) {
      console.error('Failed to check membership:', error);
      return false;
    }
  }

  // ==================== 초대 관련 ====================

  /**
   * 채널 초대
   */
  async inviteToChannel(
    channelId: string,
    userIds: string[]
  ): Promise<void> {
    try {
      for (const userId of userIds) {
        await this.channelRepository.addMember(channelId, userId);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to invite to channel');
    }
  }

  /**
   * 채널 초대 목록 조회
   */
  async getChannelInvites(channelId: string): Promise<any[]> {
    try {
      // 실제 구현에서는 Repository에 초대 관련 메서드 추가 필요
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get channel invites');
    }
  }

  /**
   * 초대 수락
   */
  async acceptInvite(inviteId: string): Promise<void> {
    try {
      // 실제 구현에서는 Repository에 초대 수락 메서드 추가 필요
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to accept invite');
    }
  }

  /**
   * 초대 거절
   */
  async declineInvite(inviteId: string): Promise<void> {
    try {
      // 실제 구현에서는 Repository에 초대 거절 메서드 추가 필요
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to decline invite');
    }
  }

  // ==================== 카테고리 관련 ====================

  /**
   * 카테고리별 채널 조회
   */
  async getChannelsByCategory(categoryId: string): Promise<any[]> {
    try {
      // 실제 구현에서는 Repository에 카테고리별 조회 메서드 추가 필요
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get channels by category');
    }
  }

  /**
   * 채널 카테고리 할당
   */
  async assignCategory(channelId: string, categoryId: string): Promise<void> {
    try {
      await this.channelRepository.update(channelId, { categoryId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to assign category');
    }
  }

  // ==================== 검색 및 조회 ====================

  /**
   * 채널 검색
   */
  async searchChannels(query: string): Promise<any[]> {
    try {
      return await this.channelRepository.searchByName(query);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search channels');
    }
  }

  /**
   * 사용자별 채널 조회
   */
  async getChannelsByUser(userId: string): Promise<any[]> {
    try {
      return await this.channelRepository.findByUser(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get channels by user');
    }
  }

  // ==================== 유틸리티 메서드 ====================

  /**
   * 채널 상태 업데이트
   */
  async updateChannelStatus(
    channelId: string,
    status: string
  ): Promise<boolean> {
    try {
      await this.channelRepository.update(channelId, { status });
      return true;
    } catch (error) {
      console.error('Failed to update channel status:', error);
      return false;
    }
  }

  /**
   * 채널 통계 조회
   */
  async getChannelStats(channelId: string): Promise<any> {
    try {
      // 실제 구현에서는 Repository에 통계 메서드 추가 필요
      return {
        channelId,
        memberCount: 0,
        messageCount: 0,
        createdAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get channel stats');
    }
  }

  // ==================== 검증 메서드 ====================

  /**
   * 채널 요청 검증
   */
  private validateChannelRequest(
    request: CreateChannelRequest | UpdateChannelRequest
  ): string[] {
    const errors: string[] = [];

    if ('name' in request && request.name && !this.isValidChannelName(request.name)) {
      errors.push('Invalid channel name format');
    }

    if ('name' in request && (!request.name || request.name.trim().length === 0)) {
      errors.push('Channel name is required');
    }

    if ('name' in request && request.name && request.name.length > 50) {
      errors.push('Channel name must be less than 50 characters');
    }

    if (errors.length > 0) {
      throw DomainErrorFactory.createUserValidation(errors.join(', '));
    }

    return errors;
  }

  /**
   * 채널명 유효성 검사
   */
  private isValidChannelName(name: string): boolean {
    const nameRegex = /^[a-zA-Z0-9\s\-_]{1,50}$/;
    return nameRegex.test(name);
  }
} 