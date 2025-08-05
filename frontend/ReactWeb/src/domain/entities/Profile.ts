import type { Profile } from '../dto/ProfileDto';

// Domain Entity with Business Logic
export class ProfileEntity {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _displayName: string,
    private readonly _bio: string | undefined,
    private readonly _avatar: string | undefined,
    private readonly _coverImage: string | undefined,
    private readonly _location: string | undefined,
    private readonly _website: string | undefined,
    private readonly _socialLinks: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      github?: string;
    },
    private readonly _preferences: {
      theme: 'light' | 'dark' | 'auto';
      language: string;
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
    },
    private readonly _stats: {
      followersCount: number;
      followingCount: number;
      postsCount: number;
      viewsCount: number;
    },
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {
    this.validate();
  }

  // Factory methods
  static create(userId: string, profileData: Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): ProfileEntity {
    return new ProfileEntity(
      crypto.randomUUID(),
      userId,
      profileData.displayName,
      profileData.bio,
      profileData.avatar,
      profileData.coverImage,
      profileData.location,
      profileData.website,
      profileData.socialLinks || {},
      {
        theme: profileData.preferences?.theme || 'auto',
        language: profileData.preferences?.language || 'ko',
        notifications: {
          email: profileData.preferences?.notifications?.email ?? true,
          push: profileData.preferences?.notifications?.push ?? true,
          sms: profileData.preferences?.notifications?.sms ?? false,
        },
        privacy: {
          profileVisibility: profileData.preferences?.privacy?.profileVisibility || 'public',
          showOnlineStatus: profileData.preferences?.privacy?.showOnlineStatus ?? true,
          showLastSeen: profileData.preferences?.privacy?.showLastSeen ?? true,
        }
      },
      {
        followersCount: profileData.stats?.followersCount || 0,
        followingCount: profileData.stats?.followingCount || 0,
        postsCount: profileData.stats?.postsCount || 0,
        viewsCount: profileData.stats?.viewsCount || 0,
      },
      new Date(),
      new Date()
    );
  }

  static fromData(profileData: Profile): ProfileEntity {
    return new ProfileEntity(
      profileData.id,
      profileData.userId,
      profileData.displayName,
      profileData.bio,
      profileData.avatar,
      profileData.coverImage,
      profileData.location,
      profileData.website,
      profileData.socialLinks || {},
      {
        theme: profileData.preferences?.theme || 'auto',
        language: profileData.preferences?.language || 'ko',
        notifications: {
          email: profileData.preferences?.notifications?.email ?? true,
          push: profileData.preferences?.notifications?.push ?? true,
          sms: profileData.preferences?.notifications?.sms ?? false,
        },
        privacy: {
          profileVisibility: profileData.preferences?.privacy?.profileVisibility || 'public',
          showOnlineStatus: profileData.preferences?.privacy?.showOnlineStatus ?? true,
          showLastSeen: profileData.preferences?.privacy?.showLastSeen ?? true,
        }
      },
      {
        followersCount: profileData.stats?.followersCount || 0,
        followingCount: profileData.stats?.followingCount || 0,
        postsCount: profileData.stats?.postsCount || 0,
        viewsCount: profileData.stats?.viewsCount || 0,
      },
      profileData.createdAt,
      profileData.updatedAt
    );
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new Error('Profile ID is required');
    }
    
    if (!this._userId || this._userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
    
    if (!this._displayName || this._displayName.trim().length < 1) {
      throw new Error('Display name is required');
    }
    
    if (this._displayName.length > 50) {
      throw new Error('Display name must be less than 50 characters');
    }
    
    if (this._bio && this._bio.length > 500) {
      throw new Error('Bio must be less than 500 characters');
    }
    
    if (this._website && !this.isValidUrl(this._website)) {
      throw new Error('Invalid website URL');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Business methods
  updateProfile(updates: Partial<Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): ProfileEntity {
    return new ProfileEntity(
      this._id,
      this._userId,
      updates.displayName ?? this._displayName,
      updates.bio ?? this._bio,
      updates.avatar ?? this._avatar,
      updates.coverImage ?? this._coverImage,
      updates.location ?? this._location,
      updates.website ?? this._website,
      { ...this._socialLinks, ...updates.socialLinks },
      {
        theme: updates.preferences?.theme ?? this._preferences.theme,
        language: updates.preferences?.language ?? this._preferences.language,
        notifications: {
          email: updates.preferences?.notifications?.email ?? this._preferences.notifications.email,
          push: updates.preferences?.notifications?.push ?? this._preferences.notifications.push,
          sms: updates.preferences?.notifications?.sms ?? this._preferences.notifications.sms,
        },
        privacy: {
          profileVisibility: updates.preferences?.privacy?.profileVisibility ?? this._preferences.privacy.profileVisibility,
          showOnlineStatus: updates.preferences?.privacy?.showOnlineStatus ?? this._preferences.privacy.showOnlineStatus,
          showLastSeen: updates.preferences?.privacy?.showLastSeen ?? this._preferences.privacy.showLastSeen,
        }
      },
      {
        followersCount: updates.stats?.followersCount ?? this._stats.followersCount,
        followingCount: updates.stats?.followingCount ?? this._stats.followingCount,
        postsCount: updates.stats?.postsCount ?? this._stats.postsCount,
        viewsCount: updates.stats?.viewsCount ?? this._stats.viewsCount,
      },
      this._createdAt,
      new Date()
    );
  }

  updateStats(stats: Partial<Profile['stats']>): ProfileEntity {
    return new ProfileEntity(
      this._id,
      this._userId,
      this._displayName,
      this._bio,
      this._avatar,
      this._coverImage,
      this._location,
      this._website,
      this._socialLinks,
      this._preferences,
      {
        followersCount: stats.followersCount ?? this._stats.followersCount,
        followingCount: stats.followingCount ?? this._stats.followingCount,
        postsCount: stats.postsCount ?? this._stats.postsCount,
        viewsCount: stats.viewsCount ?? this._stats.viewsCount,
      },
      this._createdAt,
      new Date()
    );
  }

  // Business logic methods
  isPublic(): boolean {
    return this._preferences.privacy.profileVisibility === 'public';
  }

  isPrivate(): boolean {
    return this._preferences.privacy.profileVisibility === 'private';
  }

  isFriendsOnly(): boolean {
    return this._preferences.privacy.profileVisibility === 'friends';
  }

  canShowOnlineStatus(): boolean {
    return this._preferences.privacy.showOnlineStatus;
  }

  canShowLastSeen(): boolean {
    return this._preferences.privacy.showLastSeen;
  }

  hasSocialLinks(): boolean {
    return Object.values(this._socialLinks).some(link => link && link.length > 0);
  }

  getSocialLinksCount(): number {
    return Object.values(this._socialLinks).filter(link => link && link.length > 0).length;
  }

  // Getters
  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get displayName(): string { return this._displayName; }
  get bio(): string | undefined { return this._bio; }
  get avatar(): string | undefined { return this._avatar; }
  get coverImage(): string | undefined { return this._coverImage; }
  get location(): string | undefined { return this._location; }
  get website(): string | undefined { return this._website; }
  get socialLinks(): Profile['socialLinks'] { return { ...this._socialLinks }; }
  get preferences(): Profile['preferences'] { return { ...this._preferences }; }
  get stats(): Profile['stats'] { return { ...this._stats }; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Data transfer
  toJSON(): Profile {
    return {
      id: this._id,
      userId: this._userId,
      displayName: this._displayName,
      bio: this._bio,
      avatar: this._avatar,
      coverImage: this._coverImage,
      location: this._location,
      website: this._website,
      socialLinks: this._socialLinks,
      preferences: this._preferences,
      stats: this._stats,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 