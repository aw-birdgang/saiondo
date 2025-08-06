import { BaseController } from '@/application/controllers/BaseController';
import { UseCaseFactory } from '@/application/usecases/UseCaseFactory';
import type { User } from '@/domain/dto/UserDto';
import type { ActivityLog } from '@/application/dto/UserActivityDto';
import type { Permission } from '@/application/dto/UserPermissionDto';

/**
 * 사용자 활동 타입 정의
 */
type UserActivity =
  | 'USER_PROFILE_VIEW'
  | 'USER_LOGIN'
  | 'USER_REGISTER'
  | 'USER_PROFILE_UPDATE';

/**
 * 사용자 통계 정보 타입
 */
interface UserStats {
  totalActivities: number;
  recentActivities: ActivityLog[];
  totalPermissions: number;
  permissions: string[];
}

/**
 * UserController - 사용자 관련 비즈니스 로직 조정
 */
export class UserController extends BaseController {
  private getCurrentUserUseCase: any = null;
  private authenticateUserUseCase: any = null;
  private registerUserUseCase: any = null;
  private updateUserUseCase: any = null;
  private logoutUserUseCase: any = null;
  private userActivityLogUseCase: any = null;
  private userPermissionUseCase: any = null;
  private useCasesInitialized = false;

  constructor() {
    super('UserController');
  }

  /**
   * UseCase 인스턴스 초기화
   */
  private async initializeUseCases(): Promise<void> {
    if (this.useCasesInitialized) return;

    try {
      // UseCaseFactory를 통해 UseCase 인스턴스 생성
      this.getCurrentUserUseCase = UseCaseFactory.createGetCurrentUserUseCase();
      this.authenticateUserUseCase =
        UseCaseFactory.createAuthenticateUserUseCase();
      this.registerUserUseCase = UseCaseFactory.createRegisterUserUseCase();
      this.updateUserUseCase = UseCaseFactory.createUpdateUserUseCase();
      this.logoutUserUseCase = UseCaseFactory.createLogoutUserUseCase();
      this.userActivityLogUseCase =
        UseCaseFactory.createUserActivityLogUseCase();
      this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();

      this.useCasesInitialized = true;
    } catch (error) {
      this.logger.error('Failed to initialize UseCases:', error);
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
   * 사용자 활동 로그 기록 헬퍼 함수
   */
  private async logUserActivity(
    userId: string,
    activity: UserActivity,
    details: string
  ): Promise<void> {
    try {
      if (
        this.userActivityLogUseCase &&
        typeof this.userActivityLogUseCase.logActivity === 'function'
      ) {
        await this.userActivityLogUseCase.logActivity({
          userId,
          activity,
          details,
        });
      }
    } catch (error) {
      this.logger.warn(`Failed to log user activity: ${activity}`, error);
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<User | null> {
    return this.executeWithTracking('getCurrentUser', {}, async () => {
      await this.ensureInitialized();

      const result = await this.getCurrentUserUseCase?.execute();
      const user = result?.user || null;

      if (user) {
        await this.logUserActivity(
          user.id,
          'USER_PROFILE_VIEW',
          '사용자 프로필 조회'
        );
      }

      return user;
    });
  }

  /**
   * 사용자 인증
   */
  async authenticateUser(email: string, password: string): Promise<User> {
    return this.executeWithTracking('authenticateUser', { email }, async () => {
      await this.ensureInitialized();

      const result = await this.authenticateUserUseCase?.execute({
        email,
        password,
      });

      if (!result?.user) {
        throw new Error('인증에 실패했습니다.');
      }

      await this.logUserActivity(result.user.id, 'USER_LOGIN', '사용자 로그인');

      return result.user;
    });
  }

  /**
   * 사용자 등록
   */
  async registerUser(userData: {
    email: string;
    password: string;
    name: string;
    avatar?: string;
  }): Promise<User> {
    return this.executeWithTracking(
      'registerUser',
      { email: userData.email, name: userData.name },
      async () => {
        await this.ensureInitialized();

        const result = await this.registerUserUseCase?.execute(userData);

        if (!result?.user) {
          throw new Error('사용자 등록에 실패했습니다.');
        }

        await this.logUserActivity(
          result.user.id,
          'USER_REGISTER',
          '사용자 회원가입'
        );

        return result.user;
      }
    );
  }

  /**
   * 사용자 정보 업데이트
   */
  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    return this.executeWithTracking(
      'updateUser',
      { userId, updateFields: Object.keys(updateData) },
      async () => {
        await this.ensureInitialized();

        const result = await this.updateUserUseCase?.execute({
          userId,
          ...updateData,
        });

        if (!result?.user) {
          throw new Error('사용자 정보 업데이트에 실패했습니다.');
        }

        await this.logUserActivity(
          result.user.id,
          'USER_PROFILE_UPDATE',
          `프로필 업데이트: ${Object.keys(updateData).join(', ')}`
        );

        return result.user;
      }
    );
  }

  /**
   * 사용자 로그아웃
   */
  async logoutUser(): Promise<void> {
    return this.executeWithTracking('logoutUser', {}, async () => {
      await this.ensureInitialized();

      await this.logoutUserUseCase?.execute();
      this.logger.info('User logged out successfully');
    });
  }

  /**
   * 사용자 권한 확인
   */
  async checkUserPermission(
    userId: string,
    permission: string,
    resource?: string
  ): Promise<boolean> {
    return this.executeWithTracking(
      'checkUserPermission',
      { userId, permission, resource },
      async () => {
        await this.ensureInitialized();

        if (
          this.userPermissionUseCase &&
          typeof this.userPermissionUseCase.checkPermission === 'function'
        ) {
          const result = await this.userPermissionUseCase.checkPermission({
            userId,
            permission,
            resource,
          });
          return result?.hasPermission || false;
        }

        return false;
      }
    );
  }

  /**
   * 사용자 활동 로그 조회
   */
  async getUserActivityLogs(
    userId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      activity?: string;
      limit?: number;
    }
  ): Promise<ActivityLog[]> {
    return this.executeWithTracking(
      'getUserActivityLogs',
      { userId, options },
      async () => {
        await this.ensureInitialized();

        if (
          this.userActivityLogUseCase &&
          typeof this.userActivityLogUseCase.getUserActivityLogs === 'function'
        ) {
          return (
            this.userActivityLogUseCase.getUserActivityLogs(
              userId,
              options?.limit || 50,
              0,
              options?.activity
            ) || []
          );
        }

        return [];
      }
    );
  }

  /**
   * 사용자 권한 목록 조회
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    return this.executeWithTracking(
      'getUserPermissions',
      { userId },
      async () => {
        await this.ensureInitialized();

        if (
          this.userPermissionUseCase &&
          typeof this.userPermissionUseCase.getUserPermissions === 'function'
        ) {
          return this.userPermissionUseCase.getUserPermissions(userId) || [];
        }

        return [];
      }
    );
  }

  /**
   * 사용자 통계 정보 조회
   */
  async getUserStats(userId: string): Promise<UserStats> {
    return this.executeWithTracking('getUserStats', { userId }, async () => {
      await this.ensureInitialized();

      const [activities, permissions] = await Promise.all([
        this.getUserActivityLogs(userId),
        this.getUserPermissions(userId),
      ]);

      return {
        totalActivities: activities.length,
        recentActivities: activities.slice(0, 10),
        totalPermissions: permissions.length,
        permissions: permissions.map(p => p.name),
      };
    });
  }
}
