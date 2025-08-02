import type { User } from '../dto/UserDto';

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
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {
    this.validate();
  }

  // Factory methods
  static create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): UserEntity {
    return new UserEntity(
      crypto.randomUUID(),
      userData.email,
      userData.username,
      userData.displayName,
      userData.avatar,
      userData.isOnline,
      userData.lastSeenAt,
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
      this._createdAt,
      new Date()
    );
  }

  // Getters
  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get username(): string { return this._username; }
  get displayName(): string | undefined { return this._displayName; }
  get avatar(): string | undefined { return this._avatar; }
  get isOnline(): boolean { return this._isOnline; }
  get lastSeen(): Date | undefined { return this._lastSeen; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

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