import { BaseController } from './BaseController';
import { UseCaseFactory } from '../usecases/UseCaseFactory';
import { CreateChannelUseCase } from '../usecases/CreateChannelUseCase';
import { InviteToChannelUseCase } from '../usecases/InviteToChannelUseCase';
import { LeaveChannelUseCase } from '../usecases/LeaveChannelUseCase';
import { UserActivityLogUseCase } from '../usecases/UserActivityLogUseCase';
import { UserPermissionUseCase } from '../usecases/UserPermissionUseCase';
import type { Channel } from '../../domain/dto/ChannelDto';
import type { User } from '../../domain/dto/UserDto';

/**
 * ChannelController - 채널 관련 비즈니스 로직 조정
 */
export class ChannelController extends BaseController {
  private readonly createChannelUseCase: CreateChannelUseCase;
  private readonly inviteToChannelUseCase: InviteToChannelUseCase;
  private readonly leaveChannelUseCase: LeaveChannelUseCase;
  private readonly userActivityLogUseCase: UserActivityLogUseCase;
  private readonly userPermissionUseCase: UserPermissionUseCase;

  constructor() {
    super('ChannelController');
    
    // Use Case 인스턴스 생성
    this.createChannelUseCase = UseCaseFactory.createCreateChannelUseCase();
    this.inviteToChannelUseCase = UseCaseFactory.createInviteToChannelUseCase();
    this.leaveChannelUseCase = UseCaseFactory.createLeaveChannelUseCase();
    this.userActivityLogUseCase = UseCaseFactory.createUserActivityLogUseCase();
    this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();
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
  }): Promise<any> {
    return this.executeWithTracking(
      'createChannel',
      { name: channelData.name, ownerId: channelData.ownerId },
      async () => {
        // 채널 생성 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId: channelData.ownerId,
          resource: 'channel',
          action: 'create'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('채널 생성 권한이 없습니다.');
        }

        const result = await this.createChannelUseCase.execute(channelData);
        
        // 채널 생성 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: channelData.ownerId,
          action: 'CHANNEL_CREATE',
          resource: 'channel',
          resourceId: result.channel.id,
          details: { channelName: channelData.name }
        });
        
        return result.channel;
      }
    );
  }

  /**
   * 채널에 사용자 초대
   */
  async inviteToChannel(
    channelId: string,
    inviterId: string,
    inviteeIds: string[]
  ): Promise<any> {
    return this.executeWithTracking(
      'inviteToChannel',
      { channelId, inviterId, inviteeCount: inviteeIds.length },
      async () => {
        // 초대 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId: inviterId,
          resource: channelId,
          action: 'invite'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('채널 초대 권한이 없습니다.');
        }

        const result = await this.inviteToChannelUseCase.execute({
          channelId,
          inviterId,
          inviteeIds
        });
        
        // 초대 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: inviterId,
          action: 'CHANNEL_INVITE',
          resource: 'channel',
          resourceId: channelId,
          details: { inviteeCount: inviteeIds.length }
        });
        
        return result;
      }
    );
  }

  /**
   * 채널에서 나가기
   */
  async leaveChannel(channelId: string, userId: string): Promise<void> {
    return this.executeWithTracking(
      'leaveChannel',
      { channelId, userId },
      async () => {
        await this.leaveChannelUseCase.execute({ channelId, userId });
        
        // 채널 나가기 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId,
          action: 'CHANNEL_LEAVE',
          resource: 'channel',
          resourceId: channelId,
          details: { left: true }
        });
      }
    );
  }

  /**
   * 채널 멤버 권한 확인
   */
  async checkChannelPermission(
    channelId: string,
    userId: string,
    action: string
  ): Promise<boolean> {
    return this.executeWithTracking(
      'checkChannelPermission',
      { channelId, userId, action },
      async () => {
        const result = await this.userPermissionUseCase.checkPermission({
          userId,
          resource: channelId,
          action
        });
        return result.hasPermission;
      }
    );
  }

  /**
   * 채널 활동 로그 조회
   */
  async getChannelActivityLogs(
    channelId: string,
    options?: {
      limit?: number;
      offset?: number;
      action?: string;
    }
  ): Promise<any[]> {
    return this.executeWithTracking(
      'getChannelActivityLogs',
      { channelId, options },
      async () => {
        // 채널 관련 활동 로그 조회
        return this.userActivityLogUseCase.getChannelActivityLogs(
          channelId,
          options?.limit ?? 50,
          options?.offset ?? 0
        );
      }
    );
  }

  /**
   * 채널 통계 정보 조회
   */
  async getChannelStats(channelId: string) {
    return this.executeWithTracking(
      'getChannelStats',
      { channelId },
      async () => {
        const [activities, memberCount] = await Promise.all([
          this.userActivityLogUseCase.getChannelActivityLogs(channelId),
          this.getChannelMemberCount(channelId)
        ]);

        return {
          channelId,
          totalActivities: activities.length,
          recentActivities: activities.slice(0, 10),
          memberCount,
          activityTypes: this.getActivityTypeStats(activities)
        };
      }
    );
  }

  /**
   * 채널 멤버 수 조회 (가상 메서드)
   */
  private async getChannelMemberCount(channelId: string): Promise<number> {
    // 실제 구현에서는 채널 리포지토리에서 조회
    return 0;
  }

  /**
   * 활동 타입별 통계 계산
   */
  private getActivityTypeStats(activities: any[]): Record<string, number> {
    const stats: Record<string, number> = {};
    
    activities.forEach(activity => {
      const type = activity.activity;
      stats[type] = (stats[type] || 0) + 1;
    });
    
    return stats;
  }
} 