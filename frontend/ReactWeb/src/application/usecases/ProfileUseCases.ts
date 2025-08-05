import type { IProfileUseCase } from './interfaces/IProfileUseCase';
// ProfileUseCaseService가 삭제되었으므로 any 타입으로 대체
type ProfileUseCaseService = any;
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
  GetFollowingResponse,
} from '../../domain/dto/ProfileDto';

/**
 * ProfileUseCases - ProfileUseCaseService를 사용하여 프로필 관련 애플리케이션 로직 조율
 */
export class ProfileUseCases implements IProfileUseCase {
  constructor(private readonly profileUseCaseService: ProfileUseCaseService) {}

  /**
   * 프로필 생성
   */
  async createProfile(
    request: CreateProfileRequest
  ): Promise<CreateProfileResponse> {
    const response = await this.profileUseCaseService.createProfile(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create profile');
    }

    return response;
  }

  /**
   * 프로필 조회
   */
  async getProfile(request: GetProfileRequest): Promise<GetProfileResponse> {
    const response = await this.profileUseCaseService.getProfile(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get profile');
    }

    return response;
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(
    request: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    const response = await this.profileUseCaseService.updateProfile(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile');
    }

    return response;
  }

  /**
   * 프로필 삭제
   */
  async deleteProfile(
    request: DeleteProfileRequest
  ): Promise<DeleteProfileResponse> {
    const response = await this.profileUseCaseService.deleteProfile(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete profile');
    }

    return response;
  }

  /**
   * 프로필 검색
   */
  async searchProfiles(
    request: SearchProfilesRequest
  ): Promise<SearchProfilesResponse> {
    const response = await this.profileUseCaseService.searchProfiles(request);

    return {
      profiles: response.profiles,
      total: response.total,
      hasMore: response.total > (request.offset || 0) + (request.limit || 10),
      success: response.success,
      error: response.error,
    };
  }

  /**
   * 프로필 통계 조회
   */
  async getProfileStats(
    request: GetProfileStatsRequest
  ): Promise<GetProfileStatsResponse> {
    const response = await this.profileUseCaseService.getProfileStats(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get profile stats');
    }

    return response;
  }

  /**
   * 프로필 통계 업데이트
   */
  async updateProfileStats(
    request: UpdateProfileStatsRequest
  ): Promise<UpdateProfileStatsResponse> {
    const response =
      await this.profileUseCaseService.updateProfileStats(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile stats');
    }

    return response;
  }

  /**
   * 사용자 팔로우
   */
  async followUser(request: FollowUserRequest): Promise<FollowUserResponse> {
    const response = await this.profileUseCaseService.followUser(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to follow user');
    }

    return response;
  }

  /**
   * 사용자 언팔로우
   */
  async unfollowUser(
    request: UnfollowUserRequest
  ): Promise<UnfollowUserResponse> {
    const response = await this.profileUseCaseService.unfollowUser(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to unfollow user');
    }

    return response;
  }

  /**
   * 팔로워 목록 조회
   */
  async getFollowers(
    request: GetFollowersRequest
  ): Promise<GetFollowersResponse> {
    const response = await this.profileUseCaseService.getFollowers(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get followers');
    }

    return response;
  }

  /**
   * 팔로잉 목록 조회
   */
  async getFollowing(
    request: GetFollowingRequest
  ): Promise<GetFollowingResponse> {
    const response = await this.profileUseCaseService.getFollowing(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get following');
    }

    return response;
  }

  /**
   * 프로필 존재 여부 확인
   */
  async profileExists(userId: string): Promise<boolean> {
    return await this.profileUseCaseService.profileExists(userId);
  }

  /**
   * 팔로우 상태 확인
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return await this.profileUseCaseService.isFollowing(
      followerId,
      followingId
    );
  }

  /**
   * 캐시 통계 조회
   */
  async getProfileCacheStats(): Promise<any> {
    return await this.profileUseCaseService.getProfileCacheStats();
  }

  /**
   * 캐시 삭제
   */
  async clearProfileCache(userId?: string): Promise<boolean> {
    return await this.profileUseCaseService.clearProfileCache(userId);
  }

  /**
   * 프로필 요청 검증
   */
  validateProfileRequest(
    request: CreateProfileRequest | UpdateProfileRequest
  ): string[] {
    const errors: string[] = [];

    if (
      'displayName' in request &&
      (!request.displayName || request.displayName.trim().length < 1)
    ) {
      errors.push('Display name is required');
    }

    if (
      'displayName' in request &&
      request.displayName &&
      request.displayName.length > 50
    ) {
      errors.push('Display name must be less than 50 characters');
    }

    if ('bio' in request && request.bio && request.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    if (
      'website' in request &&
      request.website &&
      !this.isValidUrl(request.website)
    ) {
      errors.push('Invalid website URL');
    }

    return errors;
  }

  /**
   * URL 검증
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
