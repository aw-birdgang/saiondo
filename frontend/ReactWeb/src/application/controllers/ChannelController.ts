import { BaseController } from './BaseController';
import { UseCaseFactory } from '../usecases/UseCaseFactory';
import type { IUseCase } from '../usecases/interfaces/IUseCase';

/**
 * ChannelController - 채널 관련 비즈니스 로직 조정
 */
export class ChannelController extends BaseController {
  private createChannelUseCase: IUseCase | null = null;
  private inviteToChannelUseCase: IUseCase | null = null;
  private leaveChannelUseCase: IUseCase | null = null;
  private userActivityLogUseCase: IUseCase | null = null;
  private userPermissionUseCase: IUseCase | null = null;
  private useCasesInitialized = false;

  constructor() {
    super('ChannelController');
  }

  /**
   * UseCase 인스턴스 초기화
   */
  private async initializeUseCases(): Promise<void> {
    if (this.useCasesInitialized) {
      return;
    }

    try {
      // Use Case 인스턴스 생성
      this.createChannelUseCase = UseCaseFactory.createCreateChannelUseCase();
      this.inviteToChannelUseCase =
        UseCaseFactory.createInviteToChannelUseCase();
      this.leaveChannelUseCase = UseCaseFactory.createLeaveChannelUseCase();
      this.userActivityLogUseCase =
        UseCaseFactory.createUserActivityLogUseCase();
      this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();

      this.useCasesInitialized = true;
    } catch (error) {
      console.error('Failed to initialize UseCases:', error);
      throw new Error('UseCase 초기화에 실패했습니다.');
    }
  }

  /**
   * UseCase가 초기화되었는지 확인하고 초기화
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.useCasesInitialized) {
      await this.initializeUseCases();
    }
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
        await this.ensureInitialized();

        if (
          !this.userPermissionUseCase ||
          !this.createChannelUseCase ||
          !this.userActivityLogUseCase
        ) {
          throw new Error('UseCase가 초기화되지 않았습니다.');
        }

        // 채널 생성 권한 확인
        const permissionResult = await this.userPermissionUseCase.execute({
          userId: channelData.ownerId,
          resource: 'channel',
          action: 'create',
        });

        if (!permissionResult.hasPermission) {
          throw new Error('채널 생성 권한이 없습니다.');
        }

        const result = await this.createChannelUseCase.execute(channelData);

        // 채널 생성 활동 로그 기록
        await this.userActivityLogUseCase.execute({
          userId: channelData.ownerId,
          action: 'CHANNEL_CREATE',
          resource: 'channel',
          resourceId: result.channel.id,
          details: { channelName: channelData.name },
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
        await this.ensureInitialized();

        if (!this.leaveChannelUseCase || !this.userActivityLogUseCase) {
          throw new Error('UseCase가 초기화되지 않았습니다.');
        }

        await this.leaveChannelUseCase.execute({ channelId, userId });

        // 채널 나가기 활동 로그 기록
        await this.userActivityLogUseCase.execute({
          userId,
          action: 'CHANNEL_LEAVE',
          resource: 'channel',
          resourceId: channelId,
          details: { left: true },
        });
      }
    );
  }
}
