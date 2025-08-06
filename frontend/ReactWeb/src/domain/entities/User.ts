import type { User } from '@/domain/types/user';
import { UserStatus } from '@/domain/types/UserStatus';

// Domain Entity with Business Logic
export class UserEntity {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _username: string,
    private readonly _displayName: string | undefined,
    private readonly _avatar: string | undefined,
    private readonly _isOnline: boolean,
    private readonly _lastSeen: Date | undefined,
    private readonly _status: UserStatus,
    private readonly _roles: string[],
    private readonly _permissions: string[],
    private readonly _friends: string[],
    private readonly _createdChannelsCount: number,
    private readonly _maxChannelsAllowed: number,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {
    this.validate();
  }

  // Factory methods
  static create(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): UserEntity {
    return new UserEntity(
      crypto.randomUUID(),
      userData.email,
      userData.username,
      userData.displayName,
      userData.avatar,
      userData.isOnline,
      userData.lastSeenAt,
      UserStatus.ACTIVE,
      [],
      ['UPDATE_PROFILE'],
      [],
      0,
      10,
      new Date(),
      new Date()
    );
  }

  static fromData(userData: User): UserEntity {
    return new UserEntity(
      userData.id,
      userData.email,
      userData.username,
      userData.displayName,
      userData.avatar,
      userData.isOnline,
      userData.lastSeenAt,
      (userData.status as UserStatus) || UserStatus.ACTIVE,
      userData.roles || [],
      userData.permissions || ['UPDATE_PROFILE'],
      userData.friends || [],
      userData.createdChannelsCount || 0,
      userData.maxChannelsAllowed || 10,
      userData.createdAt,
      userData.updatedAt
    );
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (!this._email || !this.isValidEmail(this._email)) {
      throw new Error('Valid email is required');
    }

    if (!this._username || this._username.trim().length < 2) {
      throw new Error('Username must be at least 2 characters long');
    }

    if (this._username.length > 20) {
      throw new Error('Username must be less than 20 characters');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Business methods
  updateOnlineStatus(isOnline: boolean): UserEntity {
    return new UserEntity(
      this._id,
      this._email,
      this._username,
      this._displayName,
      this._avatar,
      isOnline,
      isOnline ? new Date() : this._lastSeen,
      this._status,
      this._roles,
      this._permissions,
      this._friends,
      this._createdChannelsCount,
      this._maxChannelsAllowed,
      this._createdAt,
      new Date()
    );
  }

  updateProfile(displayName?: string, avatar?: string): UserEntity {
    return new UserEntity(
      this._id,
      this._email,
      this._username,
      displayName ?? this._displayName,
      avatar ?? this._avatar,
      this._isOnline,
      this._lastSeen,
      this._status,
      this._roles,
      this._permissions,
      this._friends,
      this._createdChannelsCount,
      this._maxChannelsAllowed,
      this._createdAt,
      new Date()
    );
  }

  // Business logic methods
  isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  hasPermission(permission: string): boolean {
    return this._permissions.includes(permission);
  }

  hasRole(role: string): boolean {
    return this._roles.includes(role);
  }

  isFriendWith(userId: string): boolean {
    return this._friends.includes(userId);
  }

  canChangeStatusTo(newStatus: UserStatus): boolean {
    // 활성 사용자는 모든 상태로 변경 가능
    if (this._status === UserStatus.ACTIVE) {
      return true;
    }

    // 정지된 사용자는 활성으로만 변경 가능
    if (this._status === UserStatus.SUSPENDED) {
      return newStatus === UserStatus.ACTIVE;
    }

    // 차단된 사용자는 상태 변경 불가
    if (this._status === UserStatus.BANNED) {
      return false;
    }

    return true;
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get username(): string {
    return this._username;
  }
  get displayName(): string | undefined {
    return this._displayName;
  }
  get avatar(): string | undefined {
    return this._avatar;
  }
  get isOnline(): boolean {
    return this._isOnline;
  }
  get lastSeen(): Date | undefined {
    return this._lastSeen;
  }
  get status(): string {
    return this._status;
  }
  get roles(): string[] {
    return [...this._roles];
  }
  get permissions(): string[] {
    return [...this._permissions];
  }
  get friends(): string[] {
    return [...this._friends];
  }
  get createdChannelsCount(): number {
    return this._createdChannelsCount;
  }
  get maxChannelsAllowed(): number {
    return this._maxChannelsAllowed;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Data transfer
  toJSON(): User {
    return {
      id: this._id,
      email: this._email,
      username: this._username,
      displayName: this._displayName,
      avatar: this._avatar,
      isOnline: this._isOnline,
      lastSeenAt: this._lastSeen,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
