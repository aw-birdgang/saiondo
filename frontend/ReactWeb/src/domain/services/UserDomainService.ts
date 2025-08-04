import type { IUserRepository } from '../repositories/IUserRepository';
import { UserEntity } from '../entities/User';
import { DomainErrorFactory } from '../errors/DomainError';

export interface UserValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface UserPermissions {
  canCreateChannel: boolean;
  canInviteUsers: boolean;
  canDeleteMessages: boolean;
  canManageUsers: boolean;
}

export class UserDomainService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * 사용자 이메일 유효성 검증
   */
  validateEmail(email: string): UserValidationResult {
    const errors: string[] = [];
    
    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 사용자 비밀번호 유효성 검증
   */
  validatePassword(password: string): UserValidationResult {
    const errors: string[] = [];
    
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 사용자명 유효성 검증
   */
  validateUsername(username: string): UserValidationResult {
    const errors: string[] = [];
    
    if (!username || username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (username.length > 20) {
      errors.push('Username must be less than 20 characters');
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 사용자 권한 확인
   */
  async getUserPermissions(userId: string): Promise<UserPermissions> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw DomainErrorFactory.createUserNotFound(userId);
    }

    // 사용자 역할에 따른 권한 설정
    const isAdmin = user.hasRole('admin');
    const isModerator = user.hasRole('moderator');
    const isPremium = user.hasRole('premium');

    return {
      canCreateChannel: isAdmin || isModerator || isPremium,
      canInviteUsers: isAdmin || isModerator,
      canDeleteMessages: isAdmin || isModerator,
      canManageUsers: isAdmin,
    };
  }

  /**
   * 사용자 상태 업데이트 권한 확인
   */
  async canUpdateUserStatus(userId: string, targetUserId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    const targetUser = await this.userRepository.findById(targetUserId);
    
    if (!user || !targetUser) {
      return false;
    }

    // 자신의 상태는 언제든 변경 가능
    if (userId === targetUserId) {
      return true;
    }

    // 관리자는 모든 사용자 상태 변경 가능
    if (user.hasRole('admin')) {
      return true;
    }

    // 모더레이터는 일반 사용자 상태만 변경 가능
    if (user.hasRole('moderator') && !targetUser.hasRole('admin') && !targetUser.hasRole('moderator')) {
      return true;
    }

    return false;
  }

  /**
   * 사용자 프로필 업데이트 권한 확인
   */
  async canUpdateUserProfile(userId: string, targetUserId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    const targetUser = await this.userRepository.findById(targetUserId);
    
    if (!user || !targetUser) {
      return false;
    }

    // 자신의 프로필은 언제든 변경 가능
    if (userId === targetUserId) {
      return true;
    }

    // 관리자는 모든 사용자 프로필 변경 가능
    if (user.hasRole('admin')) {
      return true;
    }

    return false;
  }

  /**
   * 사용자 삭제 권한 확인
   */
  async canDeleteUser(userId: string, targetUserId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    const targetUser = await this.userRepository.findById(targetUserId);
    
    if (!user || !targetUser) {
      return false;
    }

    // 자신을 삭제할 수 없음
    if (userId === targetUserId) {
      return false;
    }

    // 관리자만 사용자 삭제 가능
    if (user.hasRole('admin')) {
      return true;
    }

    return false;
  }
}

export default UserDomainService; 