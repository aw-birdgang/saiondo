// Profile DTO Types
export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  preferences: {
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
  };
  stats: {
    followersCount: number;
    followingCount: number;
    postsCount: number;
    viewsCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
  // 백엔드 User 모델의 실제 필드들을 포함하는 추가 정보
  additionalInfo?: {
    gender?: string;
    birthDate?: string;
    point?: number;
    isSubscribed?: boolean;
    subscriptionUntil?: string;
    personaProfilesCount?: number;
    assistantsCount?: number;
    channelsCount?: number;
  };
}

// Request/Response DTOs
export interface CreateProfileRequest {
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'friends';
      showOnlineStatus?: boolean;
      showLastSeen?: boolean;
    };
  };
}

export interface CreateProfileResponse {
  success: boolean;
  profile?: Profile;
  error?: string;
}

export interface GetProfileRequest {
  userId: string;
}

export interface GetProfileResponse {
  success: boolean;
  profile?: Profile;
  error?: string;
  cached?: boolean;
  fetchedAt?: Date;
}

export interface UpdateProfileRequest {
  userId: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'friends';
      showOnlineStatus?: boolean;
      showLastSeen?: boolean;
    };
  };
}

export interface UpdateProfileResponse {
  success: boolean;
  profile?: Profile;
  error?: string;
}

export interface DeleteProfileRequest {
  userId: string;
}

export interface DeleteProfileResponse {
  success: boolean;
  error?: string;
}

export interface SearchProfilesRequest {
  query: string;
  limit?: number;
  offset?: number;
  filters?: {
    location?: string;
    hasSocialLinks?: boolean;
    profileVisibility?: 'public' | 'private' | 'friends';
  };
}

export interface SearchProfilesResponse {
  success: boolean;
  profiles: Profile[];
  total: number;
  hasMore: boolean;
  error?: string;
}

export interface GetProfileStatsRequest {
  userId: string;
}

export interface GetProfileStatsResponse {
  success: boolean;
  stats?: {
    followersCount: number;
    followingCount: number;
    postsCount: number;
    viewsCount: number;
    profileViews: number;
    lastUpdated: Date;
  };
  error?: string;
}

export interface UpdateProfileStatsRequest {
  userId: string;
  stats: {
    followersCount?: number;
    followingCount?: number;
    postsCount?: number;
    viewsCount?: number;
    profileViews?: number;
  };
}

export interface UpdateProfileStatsResponse {
  success: boolean;
  stats?: Profile['stats'];
  error?: string;
}

export interface FollowUserRequest {
  followerId: string;
  followingId: string;
}

export interface FollowUserResponse {
  success: boolean;
  isFollowing: boolean;
  error?: string;
}

export interface UnfollowUserRequest {
  followerId: string;
  followingId: string;
}

export interface UnfollowUserResponse {
  success: boolean;
  isFollowing: boolean;
  error?: string;
}

export interface GetFollowersRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetFollowersResponse {
  success: boolean;
  followers: Profile[];
  total: number;
  hasMore: boolean;
  error?: string;
}

export interface GetFollowingRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetFollowingResponse {
  success: boolean;
  following: Profile[];
  total: number;
  hasMore: boolean;
  error?: string;
}
