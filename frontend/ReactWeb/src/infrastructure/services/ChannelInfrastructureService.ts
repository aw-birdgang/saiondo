import type { IChannelRepository } from '@/domain/repositories/IChannelRepository';
import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import type { IMessageRepository } from '@/domain/repositories/IMessageRepository';
import { ChannelId } from '@/domain/value-objects/ChannelId';
import { DomainErrorFactory } from '@/domain/errors/DomainError';
import type {
  Channel,
  ChannelMember,
  ChannelInvitation,
  ChannelStats,
} from '@/domain/types/channel';

/**
 * ChannelInfrastructureService - 채널 관련 모든 기능을 통합한 Infrastructure Service
 * 채널 관리, 멤버 관리, 초대, 메시지 등을 포함
 */
export class ChannelInfrastructureService {
  constructor(
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  // ==================== 채널 관리 ====================

  /**
   * 채널 생성
   */
  async createChannel(channelData: Partial<Channel>): Promise<Channel> {
    try {
      const channel = await this.channelRepository.create(channelData);
      return channel;
    } catch (error) {
      throw DomainErrorFactory.createChannelValidation('Failed to create channel');
    }
  }

  /**
   * 채널 조회
   */
  async getChannel(channelId: string): Promise<Channel | null> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      const channel = await this.channelRepository.findById(channelIdObj.getValue());
      return channel;
    } catch (error) {
      throw DomainErrorFactory.createChannelNotFound(channelId);
    }
  }

  /**
   * 채널 업데이트
   */
  async updateChannel(channelId: string, updates: Partial<Channel>): Promise<Channel> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      const channel = await this.channelRepository.update(channelIdObj.getValue(), updates);
      return channel;
    } catch (error) {
      throw DomainErrorFactory.createChannelValidation('Failed to update channel');
    }
  }

  /**
   * 채널 삭제
   */
  async deleteChannel(channelId: string): Promise<boolean> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      await this.channelRepository.delete(channelIdObj.getValue());
      return true;
    } catch (error) {
      throw DomainErrorFactory.createChannelValidation('Failed to delete channel');
    }
  }

  /**
   * 사용자의 채널 목록 조회
   */
  async getUserChannels(userId: string): Promise<Channel[]> {
    try {
      const channels = await this.channelRepository.findByUserId(userId);
      return channels;
    } catch (error) {
      throw DomainErrorFactory.createChannelNotFound('User channels not found');
    }
  }

  /**
   * 모든 채널 조회
   */
  async getAllChannels(): Promise<Channel[]> {
    try {
      const channels = await this.channelRepository.findAll();
      return channels;
    } catch (error) {
      throw DomainErrorFactory.createChannelNotFound('Channels not found');
    }
  }

  // ==================== 멤버 관리 ====================

  /**
   * 채널에 멤버 추가
   */
  async addMember(channelId: string, userId: string): Promise<ChannelMember> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      const member = await this.channelRepository.addMember(channelIdObj.getValue(), userId);
      return member;
    } catch (error) {
      throw DomainErrorFactory.createChannelValidation('Failed to add member');
    }
  }

  /**
   * 채널에서 멤버 제거
   */
  async removeMember(channelId: string, userId: string): Promise<boolean> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      await this.channelRepository.removeMember(channelIdObj.getValue(), userId);
      return true;
    } catch (error) {
      throw DomainErrorFactory.createChannelValidation('Failed to remove member');
    }
  }

  /**
   * 채널 멤버 목록 조회
   */
  async getChannelMembers(channelId: string): Promise<ChannelMember[]> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      const members = await this.channelRepository.getMembers(channelIdObj.getValue());
      return members;
    } catch (error) {
      throw DomainErrorFactory.createChannelNotFound('Channel members not found');
    }
  }

  /**
   * 멤버 권한 업데이트
   */
  async updateMemberRole(channelId: string, userId: string, role: string): Promise<ChannelMember> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      const member = await this.channelRepository.updateMemberRole(channelIdObj.getValue(), userId, role);
      return member;
    } catch (error) {
      throw DomainErrorFactory.createChannelValidation('Failed to update member role');
    }
  }

  // ==================== 초대 관리 ====================

  /**
   * 채널 초대 생성
   */
  async createInvitation(channelId: string, inviterId: string, inviteeId: string): Promise<ChannelInvitation> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      const invitation = await this.channelRepository.createInvitation(
        channelIdObj.getValue(),
        inviterId,
        inviteeId
      );
      return invitation;
    } catch (error) {
      throw DomainErrorFactory.createChannelValidation('Failed to create invitation');
    }
  }

  /**
   * 초대 응답
   */
  async respondToInvitation(invitationId: string, accepted: boolean): Promise<boolean> {
    try {
      const result = await this.channelRepository.respondToInvitation(invitationId, accepted);
      return result;
    } catch (error) {
      throw DomainErrorFactory.createChannelValidation('Failed to respond to invitation');
    }
  }

  /**
   * 사용자의 초대 목록 조회
   */
  async getUserInvitations(userId: string): Promise<ChannelInvitation[]> {
    try {
      const invitations = await this.channelRepository.getUserInvitations(userId);
      return invitations;
    } catch (error) {
      throw DomainErrorFactory.createChannelNotFound('User invitations not found');
    }
  }

  // ==================== 채널 통계 ====================

  /**
   * 채널 통계 조회
   */
  async getChannelStats(channelId: string): Promise<ChannelStats> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      const channel = await this.channelRepository.findById(channelIdObj.getValue());
      
      if (!channel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }

      // 멤버 수
      const members = await this.channelRepository.getMembers(channelIdObj.getValue());
      const memberCount = members.length;

      // 메시지 수
      const messages = await this.messageRepository.findByChannelId(channelId);
      const messageCount = messages.length;

      // 최근 활동
      const recentActivity = await this.getRecentChannelActivity(channelId);

      return {
        channelId,
        memberCount,
        messageCount,
        createdAt: channel.createdAt,
        lastActivity: channel.updatedAt,
        recentActivity,
        isActive: channel.isActive || false,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 최근 채널 활동 조회
   */
  private async getRecentChannelActivity(channelId: string): Promise<any[]> {
    try {
      const recentMessages = await this.messageRepository.findByChannelId(channelId);
      const recentMembers = await this.channelRepository.getMembers(channelId);

      return [
        ...recentMessages.slice(0, 10).map(msg => ({
          type: 'message',
          content: msg.content,
          userId: msg.userId,
          timestamp: msg.createdAt,
        })),
        ...recentMembers.slice(0, 5).map(member => ({
          type: 'member_join',
          content: `${member.username} joined`,
          userId: member.userId,
          timestamp: member.joinedAt,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      return [];
    }
  }

  // ==================== 검색 및 필터링 ====================

  /**
   * 채널 검색
   */
  async searchChannels(query: string, limit: number = 10): Promise<Channel[]> {
    try {
      const allChannels = await this.channelRepository.findAll();
      const filteredChannels = allChannels.filter(channel =>
        channel.name.toLowerCase().includes(query.toLowerCase()) ||
        channel.description?.toLowerCase().includes(query.toLowerCase())
      );
      return filteredChannels.slice(0, limit);
    } catch (error) {
      throw DomainErrorFactory.createChannelNotFound('Search failed');
    }
  }

  /**
   * 카테고리별 채널 조회
   */
  async getChannelsByCategory(category: string): Promise<Channel[]> {
    try {
      const allChannels = await this.channelRepository.findAll();
      return allChannels.filter(channel => channel.category === category);
    } catch (error) {
      throw DomainErrorFactory.createChannelNotFound('Category channels not found');
    }
  }

  /**
   * 공개 채널 조회
   */
  async getPublicChannels(): Promise<Channel[]> {
    try {
      const allChannels = await this.channelRepository.findAll();
      return allChannels.filter(channel => channel.isPublic);
    } catch (error) {
      throw DomainErrorFactory.createChannelNotFound('Public channels not found');
    }
  }

  // ==================== 권한 확인 ====================

  /**
   * 사용자가 채널에 접근할 수 있는지 확인
   */
  async canUserAccessChannel(userId: string, channelId: string): Promise<boolean> {
    try {
      const channelIdObj = ChannelId.create(channelId);
      const channel = await this.channelRepository.findById(channelIdObj.getValue());
      
      if (!channel) {
        return false;
      }

      // 공개 채널이면 접근 가능
      if (channel.isPublic) {
        return true;
      }

      // 멤버인지 확인
      const members = await this.channelRepository.getMembers(channelIdObj.getValue());
      return members.some(member => member.userId === userId);
    } catch (error) {
      return false;
    }
  }

  /**
   * 사용자가 채널에서 메시지를 보낼 수 있는지 확인
   */
  async canUserSendMessage(userId: string, channelId: string): Promise<boolean> {
    try {
      const canAccess = await this.canUserAccessChannel(userId, channelId);
      if (!canAccess) {
        return false;
      }

      // 채널이 활성 상태인지 확인
      const channelIdObj = ChannelId.create(channelId);
      const channel = await this.channelRepository.findById(channelIdObj.getValue());
      
      return channel?.isActive || false;
    } catch (error) {
      return false;
    }
  }
} 