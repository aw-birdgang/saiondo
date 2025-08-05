import type { IProfileRepository } from '../../../../domain/repositories/IProfileRepository';
import { ProfileEntity } from '../../../../domain/entities/Profile';
import type {
  CreateProfileRequest,
  CreateProfileResponse,
  GetProfileRequest,
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  DeleteProfileRequest,
  DeleteProfileResponse,
  SearchProfilesRequest,
  SearchProfilesResponse,
  GetProfileStatsRequest,
  GetProfileStatsResponse,
  UpdateProfileStatsRequest,
  UpdateProfileStatsResponse,
  FollowUserRequest,
  FollowUserResponse,
  UnfollowUserRequest,
  UnfollowUserResponse,
  GetFollowersRequest,
  GetFollowersResponse,
  GetFollowingRequest,
  GetFollowingResponse
} from '../../../../domain/dto/ProfileDto';

/**
 * ProfileUseCaseService - 프로필 관련 비즈니스 로직 처리
 */
export class ProfileUseCaseService {
  constructor(private readonly profileRepository: IProfileRepository) {}

  /**
   * 프로필 생성
   */
  async createProfile(request: CreateProfileRequest): Promise<CreateProfileResponse> {
    try {
      // 프로필 존재 여부 확인
      const exists = await this.profileRepository.profileExists(request.userId);
      if (exists) {
        return {
          success: false,
          error: 'Profile already exists for this user'
        };
      }

      // 프로필 엔티티 생성
      const profileEntity = ProfileEntity.create(request.userId, {
        displayName: request.displayName,
        bio: request.bio,
        avatar: request.avatar,
        coverImage: request.coverImage,
        location: request.location,
        website: request.website,
        socialLinks: request.socialLinks,
        preferences: request.preferences,
        stats: {
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          viewsCount: 0
        }
      });

      // Repository를 통한 저장
      const response = await this.profileRepository.createProfile(request);
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create profile'
      };
    }
  }

  /**
   * 프로필 조회
   */
  async getProfile(request: GetProfileRequest): Promise<GetProfileResponse> {
    try {
      const response = await this.profileRepository.getProfile(request);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile'
      };
    }
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      // 기존 프로필 조회
      const existingProfile = await this.profileRepository.getProfile({ userId: request.userId });
      if (!existingProfile.success || !existingProfile.profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      // 프로필 엔티티 생성 및 업데이트
      const profileEntity = ProfileEntity.fromData(existingProfile.profile);
      const updatedEntity = profileEntity.updateProfile(request);

      // Repository를 통한 업데이트
      const response = await this.profileRepository.updateProfile(request);
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  }

  /**
   * 프로필 삭제
   */
  async deleteProfile(request: DeleteProfileRequest): Promise<DeleteProfileResponse> {
    try {
      const response = await this.profileRepository.deleteProfile(request);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete profile'
      };
    }
  }

  /**
   * 프로필 검색
   */
  async searchProfiles(request: SearchProfilesRequest): Promise<SearchProfilesResponse> {
    try {
      const response = await this.profileRepository.searchProfiles(request);
      return response;
    } catch (error) {
      return {
        success: false,
        profiles: [],
        total: 0,
        hasMore: false,
        error: error instanceof Error ? error.message : 'Failed to search profiles'
      };
    }
  }

  /**
   * 프로필 통계 조회
   */
  async getProfileStats(request: GetProfileStatsRequest): Promise<GetProfileStatsResponse> {
    try {
      const response = await this.profileRepository.getProfileStats(request);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile stats'
      };
    }
  }

  /**
   * 프로필 통계 업데이트
   */
  async updateProfileStats(request: UpdateProfileStatsRequest): Promise<UpdateProfileStatsResponse> {
    try {
      const response = await this.profileRepository.updateProfileStats(request);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile stats'
      };
    }
  }

  /**
   * 사용자 팔로우
   */
  async followUser(request: FollowUserRequest): Promise<FollowUserResponse> {
    try {
      // 자기 자신을 팔로우할 수 없음
      if (request.followerId === request.followingId) {
        return {
          success: false,
          isFollowing: false,
          error: 'Cannot follow yourself'
        };
      }

      const response = await this.profileRepository.followUser(request);
      return response;
    } catch (error) {
      return {
        success: false,
        isFollowing: false,
        error: error instanceof Error ? error.message : 'Failed to follow user'
      };
    }
  }

  /**
   * 사용자 언팔로우
   */
  async unfollowUser(request: UnfollowUserRequest): Promise<UnfollowUserResponse> {
    try {
      const response = await this.profileRepository.unfollowUser(request);
      return response;
    } catch (error) {
      return {
        success: false,
        isFollowing: false,
        error: error instanceof Error ? error.message : 'Failed to unfollow user'
      };
    }
  }

  /**
   * 팔로워 목록 조회
   */
  async getFollowers(request: GetFollowersRequest): Promise<GetFollowersResponse> {
    try {
      const response = await this.profileRepository.getFollowers(request);
      return response;
    } catch (error) {
      return {
        success: false,
        followers: [],
        total: 0,
        hasMore: false,
        error: error instanceof Error ? error.message : 'Failed to get followers'
      };
    }
  }

  /**
   * 팔로잉 목록 조회
   */
  async getFollowing(request: GetFollowingRequest): Promise<GetFollowingResponse> {
    try {
      const response = await this.profileRepository.getFollowing(request);
      return response;
    } catch (error) {
      return {
        success: false,
        following: [],
        total: 0,
        hasMore: false,
        error: error instanceof Error ? error.message : 'Failed to get following'
      };
    }
  }

  /**
   * 프로필 존재 여부 확인
   */
  async profileExists(userId: string): Promise<boolean> {
    try {
      return await this.profileRepository.profileExists(userId);
    } catch (error) {
      return false;
    }
  }

  /**
   * 팔로우 상태 확인
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      return await this.profileRepository.isFollowing(followerId, followingId);
    } catch (error) {
      return false;
    }
  }

  /**
   * 캐시 통계 조회
   */
  async getProfileCacheStats(): Promise<any> {
    try {
      return await this.profileRepository.getProfileCacheStats();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get cache stats'
      };
    }
  }

  /**
   * 캐시 삭제
   */
  async clearProfileCache(userId?: string): Promise<boolean> {
    try {
      return await this.profileRepository.clearProfileCache(userId);
    } catch (error) {
      return false;
    }
  }
} 