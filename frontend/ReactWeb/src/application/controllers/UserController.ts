import { BaseController } from './BaseController';
import { UseCaseFactory } from '../usecases/UseCaseFactory';
import { GetCurrentUserUseCase } from '../usecases/GetCurrentUserUseCase';
import { AuthenticateUserUseCase } from '../usecases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from '../usecases/RegisterUserUseCase';
import { UpdateUserUseCase } from '../usecases/UpdateUserUseCase';
import { LogoutUserUseCase } from '../usecases/LogoutUserUseCase';
import { UserActivityLogUseCase } from '../usecases/UserActivityLogUseCase';
import { UserPermissionUseCase } from '../usecases/UserPermissionUseCase';
import type { User } from '../../domain/dto/UserDto';
import type { UserActivityDto } from '../dto/UserActivityDto';
import type { UserPermissionDto } from '../dto/UserPermissionDto';

/**
 * UserController - 사용자 관련 비즈니스 로직 조정
 */
export class UserController extends BaseController {
  private readonly getCurrentUserUseCase: GetCurrentUserUseCase;
  private readonly authenticateUserUseCase: AuthenticateUserUseCase;
  private readonly registerUserUseCase: RegisterUserUseCase;
  private readonly updateUserUseCase: UpdateUserUseCase;
  private readonly logoutUserUseCase: LogoutUserUseCase;
  private readonly userActivityLogUseCase: UserActivityLogUseCase;
  private readonly userPermissionUseCase: UserPermissionUseCase;

  constructor() {
    super('UserController');
    
    // Use Case 인스턴스 생성
    this.getCurrentUserUseCase = UseCaseFactory.createGetCurrentUserUseCase();
    this.authenticateUserUseCase = UseCaseFactory.createAuthenticateUserUseCase();
    this.registerUserUseCase = UseCaseFactory.createRegisterUserUseCase();
    this.updateUserUseCase = UseCaseFactory.createUpdateUserUseCase();
    this.logoutUserUseCase = UseCaseFactory.createLogoutUserUseCase();
    this.userActivityLogUseCase = UseCaseFactory.createUserActivityLogUseCase();
    this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<User | null> {
    return this.executeWithTracking(
      'getCurrentUser',
      {},
      async () => {
        const user = await this.getCurrentUserUseCase.execute();
        
        // 사용자 활동 로그 기록
        if (user) {
          await this.userActivityLogUseCase.logActivity({
            userId: user.id,
            activity: 'USER_PROFILE_VIEW',
            details: '사용자 프로필 조회'
          });
        }
        
        return user;
      }
    );
  }

  /**
   * 사용자 인증
   */
  async authenticateUser(email: string, password: string): Promise<User> {
    return this.executeWithTracking(
      'authenticateUser',
      { email },
      async () => {
        const user = await this.authenticateUserUseCase.execute({ email, password });
        
        // 로그인 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: user.id,
          activity: 'USER_LOGIN',
          details: '사용자 로그인'
        });
        
        return user;
      }
    );
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
        const user = await this.registerUserUseCase.execute(userData);
        
        // 회원가입 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: user.id,
          activity: 'USER_REGISTER',
          details: '사용자 회원가입'
        });
        
        return user;
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
        const user = await this.updateUserUseCase.execute({ userId, ...updateData });
        
        // 프로필 업데이트 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: user.id,
          activity: 'USER_PROFILE_UPDATE',
          details: `프로필 업데이트: ${Object.keys(updateData).join(', ')}`
        });
        
        return user;
      }
    );
  }

  /**
   * 사용자 로그아웃
   */
  async logoutUser(): Promise<void> {
    return this.executeWithTracking(
      'logoutUser',
      {},
      async () => {
        await this.logoutUserUseCase.execute();
        
        // 로그아웃 활동 로그 기록 (사용자 ID가 없으므로 별도 처리)
        this.logger.info('User logged out successfully');
      }
    );
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
        return this.userPermissionUseCase.checkPermission({
          userId,
          permission,
          resource
        });
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
  ): Promise<UserActivityDto[]> {
    return this.executeWithTracking(
      'getUserActivityLogs',
      { userId, options },
      async () => {
        return this.userActivityLogUseCase.getUserActivities(userId, options);
      }
    );
  }

  /**
   * 사용자 권한 목록 조회
   */
  async getUserPermissions(userId: string): Promise<UserPermissionDto[]> {
    return this.executeWithTracking(
      'getUserPermissions',
      { userId },
      async () => {
        return this.userPermissionUseCase.getUserPermissions(userId);
      }
    );
  }

  /**
   * 사용자 통계 정보 조회
   */
  async getUserStats(userId: string) {
    return this.executeWithTracking(
      'getUserStats',
      { userId },
      async () => {
        const [activities, permissions] = await Promise.all([
          this.userActivityLogUseCase.getUserActivities(userId),
          this.userPermissionUseCase.getUserPermissions(userId)
        ]);

        return {
          totalActivities: activities.length,
          recentActivities: activities.slice(0, 10),
          totalPermissions: permissions.length,
          permissions: permissions.map(p => p.permission)
        };
      }
    );
  }
} 