import {BaseController} from './BaseController';
import {UseCaseFactory} from '../usecases/UseCaseFactory';
import {CreateChannelUseCase} from '../usecases/CreateChannelUseCase';
import {InviteToChannelUseCase} from '../usecases/InviteToChannelUseCase';
import {LeaveChannelUseCase} from '../usecases/LeaveChannelUseCase';
import {UserActivityLogUseCase} from '../usecases/UserActivityLogUseCase';
import {UserPermissionUseCase} from '../usecases/UserPermissionUseCase';

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

}
