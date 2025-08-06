import type { Profile } from '@/domain/dto/ProfileDto';

export interface ProfileUseCaseService {
  getProfile: (params: { userId: string }) => Promise<{ success: boolean; profile?: Profile; error?: string }>;
  updateProfile: (params: { userId: string; updates: Partial<Profile> }) => Promise<{ success: boolean; profile?: Profile; error?: string }>;
  getProfileStats: (params: { userId: string }) => Promise<{ success: boolean; stats?: any; error?: string }>;
  followUser: (params: { followerId: string; followingId: string }) => Promise<{ success: boolean; error?: string }>;
  unfollowUser: (params: { followerId: string; followingId: string }) => Promise<{ success: boolean; error?: string }>;
  getFollowers: (params: { userId: string; limit?: number; offset?: number }) => Promise<{ success: boolean; followers?: any[]; error?: string }>;
  getFollowing: (params: { userId: string; limit?: number; offset?: number }) => Promise<{ success: boolean; following?: any[]; error?: string }>;
  getPosts: (params: { userId: string }) => Promise<{ success: boolean; posts?: any[]; error?: string }>;
  searchProfiles: (params: { query: string; limit?: number }) => Promise<{ success: boolean; profiles?: Profile[]; error?: string }>;
}

export class ProfileUseCases {
  constructor(private profileService: ProfileUseCaseService) {}

  async getProfile(params: { userId: string }) {
    try {
      return await this.profileService.getProfile(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile',
      };
    }
  }

  async updateProfile(params: { userId: string; updates: Partial<Profile> }) {
    try {
      return await this.profileService.updateProfile(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  }

  async getProfileStats(params: { userId: string }) {
    try {
      return await this.profileService.getProfileStats(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile stats',
      };
    }
  }

  async followUser(params: { followerId: string; followingId: string }) {
    try {
      return await this.profileService.followUser(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to follow user',
      };
    }
  }

  async unfollowUser(params: { followerId: string; followingId: string }) {
    try {
      return await this.profileService.unfollowUser(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unfollow user',
      };
    }
  }

  async getFollowers(params: { userId: string; limit?: number; offset?: number }) {
    try {
      return await this.profileService.getFollowers(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get followers',
      };
    }
  }

  async getFollowing(params: { userId: string; limit?: number; offset?: number }) {
    try {
      return await this.profileService.getFollowing(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get following',
      };
    }
  }

  async getPosts(params: { userId: string }) {
    try {
      return await this.profileService.getPosts(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get posts',
      };
    }
  }

  async searchProfiles(params: { query: string; limit?: number }) {
    try {
      return await this.profileService.searchProfiles(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search profiles',
      };
    }
  }
} 