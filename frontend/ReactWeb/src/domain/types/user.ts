export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  isOnline: boolean;
  lastSeenAt?: Date;
  status?: string;
  roles?: string[];
  permissions?: string[];
  friends?: string[];
  createdChannelsCount?: number;
  maxChannelsAllowed?: number;
  createdAt: Date;
  updatedAt: Date;
  toJSON(): User;
}

// User 클래스 구현
export class UserImpl implements User {
  constructor(
    public id: string,
    public email: string,
    public username: string,
    public displayName: string | undefined,
    public avatar: string | undefined,
    public isOnline: boolean,
    public lastSeenAt: Date | undefined,
    public status: string | undefined,
    public roles: string[] | undefined,
    public permissions: string[] | undefined,
    public friends: string[] | undefined,
    public createdChannelsCount: number | undefined,
    public maxChannelsAllowed: number | undefined,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  toJSON(): User {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      displayName: this.displayName,
      avatar: this.avatar,
      isOnline: this.isOnline,
      lastSeenAt: this.lastSeenAt,
      status: this.status,
      roles: this.roles,
      permissions: this.permissions,
      friends: this.friends,
      createdChannelsCount: this.createdChannelsCount,
      maxChannelsAllowed: this.maxChannelsAllowed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      toJSON: this.toJSON,
    };
  }
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  birthDate?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      showOnlineStatus: boolean;
      showLastSeen: boolean;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
} 