import { ApiClient } from '../ApiClient';
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
} from '../../../domain/dto/ProfileDto';

/**
 * Profile API Service
 * 백엔드 Profile API와의 실제 연동을 담당
 */
export class ProfileService {
  private readonly apiClient: ApiClient;
  private readonly baseUrl = '/api/profiles';

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * 프로필 생성
   */
  async createProfile(
    request: CreateProfileRequest
  ): Promise<CreateProfileResponse> {
    try {
      const response = await this.apiClient.post(this.baseUrl, request);
      return response.data;
    } catch (error) {
      return this.handleError<CreateProfileResponse>(error, {
        success: false,
        error: 'Failed to create profile',
      });
    }
  }

  /**
   * 프로필 조회
   */
  async getProfile(request: GetProfileRequest): Promise<GetProfileResponse> {
    try {
      const response = await this.apiClient.get(
        `${this.baseUrl}/${request.userId}`
      );
      return {
        ...response.data,
        cached: false,
        fetchedAt: new Date(),
      };
    } catch (error) {
      return this.handleError<GetProfileResponse>(error, {
        success: false,
        error: 'Failed to get profile',
      });
    }
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(
    request: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    try {
      const response = await this.apiClient.put(
        `${this.baseUrl}/${request.userId}`,
        request
      );
      return response.data;
    } catch (error) {
      return this.handleError<UpdateProfileResponse>(error, {
        success: false,
        error: 'Failed to update profile',
      });
    }
  }

  /**
   * 프로필 삭제
   */
  async deleteProfile(
    request: DeleteProfileRequest
  ): Promise<DeleteProfileResponse> {
    try {
      const response = await this.apiClient.delete(
        `${this.baseUrl}/${request.userId}`
      );
      return response.data;
    } catch (error) {
      return this.handleError<DeleteProfileResponse>(error, {
        success: false,
        error: 'Failed to delete profile',
      });
    }
  }

  /**
   * 프로필 검색
   */
  async searchProfiles(
    request: SearchProfilesRequest
  ): Promise<SearchProfilesResponse> {
    try {
      const params = new URLSearchParams({
        q: request.query,
        limit: (request.limit || 10).toString(),
        offset: (request.offset || 0).toString(),
        ...(request.filters?.location && {
          location: request.filters.location,
        }),
        ...(request.filters?.hasSocialLinks !== undefined && {
          hasSocialLinks: request.filters.hasSocialLinks.toString(),
        }),
        ...(request.filters?.profileVisibility && {
          profileVisibility: request.filters.profileVisibility,
        }),
      });

      const response = await this.apiClient.get(
        `${this.baseUrl}/search?${params}`
      );
      return response.data;
    } catch (error) {
      return this.handleError<SearchProfilesResponse>(error, {
        success: false,
        profiles: [],
        total: 0,
        hasMore: false,
        error: 'Failed to search profiles',
      });
    }
  }

  /**
   * 프로필 통계 조회
   */
  async getProfileStats(
    request: GetProfileStatsRequest
  ): Promise<GetProfileStatsResponse> {
    try {
      const response = await this.apiClient.get(
        `${this.baseUrl}/${request.userId}/stats`
      );
      return response.data;
    } catch (error) {
      return this.handleError<GetProfileStatsResponse>(error, {
        success: false,
        error: 'Failed to get profile stats',
      });
    }
  }

  /**
   * 프로필 통계 업데이트
   */
  async updateProfileStats(
    request: UpdateProfileStatsRequest
  ): Promise<UpdateProfileStatsResponse> {
    try {
      const response = await this.apiClient.put(
        `${this.baseUrl}/${request.userId}/stats`,
        request.stats
      );
      return response.data;
    } catch (error) {
      return this.handleError<UpdateProfileStatsResponse>(error, {
        success: false,
        error: 'Failed to update profile stats',
      });
    }
  }

  /**
   * 사용자 팔로우
   */
  async followUser(request: FollowUserRequest): Promise<FollowUserResponse> {
    try {
      const response = await this.apiClient.post(
        `${this.baseUrl}/${request.followingId}/follow`,
        {
          followerId: request.followerId,
        }
      );
      return response.data;
    } catch (error) {
      return this.handleError<FollowUserResponse>(error, {
        success: false,
        isFollowing: false,
        error: 'Failed to follow user',
      });
    }
  }

  /**
   * 사용자 언팔로우
   */
  async unfollowUser(
    request: UnfollowUserRequest
  ): Promise<UnfollowUserResponse> {
    try {
      const response = await this.apiClient.delete(
        `${this.baseUrl}/${request.followingId}/follow`,
        {
          data: { followerId: request.followerId },
        }
      );
      return response.data;
    } catch (error) {
      return this.handleError<UnfollowUserResponse>(error, {
        success: false,
        isFollowing: false,
        error: 'Failed to unfollow user',
      });
    }
  }

  /**
   * 팔로워 목록 조회
   */
  async getFollowers(
    request: GetFollowersRequest
  ): Promise<GetFollowersResponse> {
    try {
      const params = new URLSearchParams({
        limit: (request.limit || 10).toString(),
        offset: (request.offset || 0).toString(),
      });

      const response = await this.apiClient.get(
        `${this.baseUrl}/${request.userId}/followers?${params}`
      );
      return response.data;
    } catch (error) {
      return this.handleError<GetFollowersResponse>(error, {
        success: false,
        followers: [],
        total: 0,
        hasMore: false,
        error: 'Failed to get followers',
      });
    }
  }

  /**
   * 팔로잉 목록 조회
   */
  async getFollowing(
    request: GetFollowingRequest
  ): Promise<GetFollowingResponse> {
    try {
      const params = new URLSearchParams({
        limit: (request.limit || 10).toString(),
        offset: (request.offset || 0).toString(),
      });

      const response = await this.apiClient.get(
        `${this.baseUrl}/${request.userId}/following?${params}`
      );
      return response.data;
    } catch (error) {
      return this.handleError<GetFollowingResponse>(error, {
        success: false,
        following: [],
        total: 0,
        hasMore: false,
        error: 'Failed to get following',
      });
    }
  }

  /**
   * 프로필 존재 여부 확인
   */
  async profileExists(userId: string): Promise<boolean> {
    try {
      const response = await this.apiClient.head(`${this.baseUrl}/${userId}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * 팔로우 상태 확인
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      const response = await this.apiClient.get(
        `${this.baseUrl}/${followingId}/followers/${followerId}`
      );
      return response.data.isFollowing;
    } catch (error) {
      return false;
    }
  }

  /**
   * 이미지 업로드
   */
  async uploadImage(
    file: File,
    type: 'avatar' | 'cover'
  ): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const response = await this.apiClient.post(
        `${this.baseUrl}/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  }

  /**
   * 프로필 백업
   */
  async backupProfile(userId: string): Promise<{ downloadUrl: string }> {
    try {
      const response = await this.apiClient.post(
        `${this.baseUrl}/${userId}/backup`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to backup profile');
    }
  }

  /**
   * 프로필 복원
   */
  async restoreProfile(userId: string, backupData: any): Promise<boolean> {
    try {
      const response = await this.apiClient.post(
        `${this.baseUrl}/${userId}/restore`,
        backupData
      );
      return response.data.success;
    } catch (error) {
      throw new Error('Failed to restore profile');
    }
  }

  /**
   * 프로필 분석 데이터 조회
   */
  async getProfileAnalytics(
    userId: string,
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<any> {
    try {
      const response = await this.apiClient.get(
        `${this.baseUrl}/${userId}/analytics?period=${period}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to get profile analytics');
    }
  }

  /**
   * 에러 처리 헬퍼 메서드
   */
  private handleError<T>(error: any, defaultResponse: T): T {
    console.error('API Error:', error);

    if (error.response?.data?.message) {
      return {
        ...defaultResponse,
        error: error.response.data.message,
      } as T;
    }

    if (error.message) {
      return {
        ...defaultResponse,
        error: error.message,
      } as T;
    }

    return defaultResponse;
  }
}
