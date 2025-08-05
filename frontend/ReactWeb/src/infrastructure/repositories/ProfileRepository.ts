import type { IProfileRepository } from '../../domain/repositories/IProfileRepository';
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
import { ApiClient } from '../api/ApiClient';

// API Response 타입 정의
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

interface ProfileApiResponse {
  success: boolean;
  profile?: any;
  error?: string;
  cached?: boolean;
  fetchedAt?: Date;
}

interface CacheItem {
  data: unknown;
  timestamp: number;
}

interface CacheStats {
  size: number;
  keys: string[];
  timestamp: Date;
}

/**
 * ProfileRepository - 프로필 관련 데이터 접근 구현
 */
export class ProfileRepository implements IProfileRepository {
  private readonly baseUrl = '/api/profiles';
  private readonly cache = new Map<string, CacheItem>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5분
  private readonly apiClient = new ApiClient();

  /**
   * 프로필 생성
   */
  async createProfile(
    request: CreateProfileRequest
  ): Promise<CreateProfileResponse> {
    try {
      const response = await this.apiClient.post<ProfileApiResponse>(`${this.baseUrl}`, request);

      if (response.success && response.profile) {
        // 캐시에 저장
        this.setCache(
          `profile:${response.profile.userId}`,
          response.profile
        );
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * 프로필 조회
   */
  async getProfile(request: GetProfileRequest): Promise<GetProfileResponse> {
    try {
      // 캐시 확인
      const cached = this.getCache(`profile:${request.userId}`);
      if (cached) {
        return {
          success: true,
          profile: cached as any,
          cached: true,
          fetchedAt: new Date(),
        };
      }

      const response = await this.apiClient.get<ProfileApiResponse>(
        `${this.baseUrl}/${request.userId}`
      );

      if (response.success && response.profile) {
        // 캐시에 저장
        this.setCache(`profile:${request.userId}`, response.profile);
      }

      return {
        ...response,
        cached: false,
        fetchedAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(
    request: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    try {
      const response = await this.apiClient.put<ProfileApiResponse>(
        `${this.baseUrl}/${request.userId}`,
        request
      );

      if (response.success && response.profile) {
        // 캐시 업데이트
        this.setCache(`profile:${request.userId}`, response.profile);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * 프로필 삭제
   */
  async deleteProfile(
    request: DeleteProfileRequest
  ): Promise<DeleteProfileResponse> {
    try {
      const response = await this.apiClient.delete<ProfileApiResponse>(
        `${this.baseUrl}/${request.userId}`
      );

      // 캐시 삭제
      this.deleteCache(`profile:${request.userId}`);

      return response;
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
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

      const response = await this.apiClient.get<SearchProfilesResponse>(
        `${this.baseUrl}/search?${params}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        profiles: [],
        total: 0,
        hasMore: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * 프로필 통계 조회
   */
  async getProfileStats(
    request: GetProfileStatsRequest
  ): Promise<GetProfileStatsResponse> {
    try {
      const response = await this.apiClient.get<GetProfileStatsResponse>(
        `${this.baseUrl}/${request.userId}/stats`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * 프로필 통계 업데이트
   */
  async updateProfileStats(
    request: UpdateProfileStatsRequest
  ): Promise<UpdateProfileStatsResponse> {
    try {
      const response = await this.apiClient.put<UpdateProfileStatsResponse>(
        `${this.baseUrl}/${request.userId}/stats`,
        request.stats
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * 사용자 팔로우
   */
  async followUser(request: FollowUserRequest): Promise<FollowUserResponse> {
    try {
      const response = await this.apiClient.post<FollowUserResponse>(
        `${this.baseUrl}/${request.followingId}/follow`,
        {
          followerId: request.followerId,
        }
      );

      // 관련 캐시 삭제
      this.deleteCache(`profile:${request.followerId}`);
      this.deleteCache(`profile:${request.followingId}`);

      return response;
    } catch (error) {
      return {
        success: false,
        isFollowing: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * 사용자 언팔로우
   */
  async unfollowUser(
    request: UnfollowUserRequest
  ): Promise<UnfollowUserResponse> {
    try {
      const response = await this.apiClient.delete<UnfollowUserResponse>(
        `${this.baseUrl}/${request.followingId}/follow`,
        {
          data: { followerId: request.followerId },
        }
      );

      // 관련 캐시 삭제
      this.deleteCache(`profile:${request.followerId}`);
      this.deleteCache(`profile:${request.followingId}`);

      return response;
    } catch (error) {
      return {
        success: false,
        isFollowing: false,
        error: this.getErrorMessage(error),
      };
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

      const response = await this.apiClient.get<GetFollowersResponse>(
        `${this.baseUrl}/${request.userId}/followers?${params}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        followers: [],
        total: 0,
        hasMore: false,
        error: this.getErrorMessage(error),
      };
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

      const response = await this.apiClient.get<GetFollowingResponse>(
        `${this.baseUrl}/${request.userId}/following?${params}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        following: [],
        total: 0,
        hasMore: false,
        error: this.getErrorMessage(error),
      };
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
      const response = await this.apiClient.get<{ isFollowing: boolean }>(
        `${this.baseUrl}/${followingId}/followers/${followerId}`
      );
      return response.isFollowing;
    } catch (error) {
      return false;
    }
  }

  /**
   * 캐시 통계 조회
   */
  async getProfileCacheStats(): Promise<CacheStats> {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timestamp: new Date(),
    };
  }

  /**
   * 캐시 삭제
   */
  async clearProfileCache(userId?: string): Promise<boolean> {
    try {
      if (userId) {
        this.deleteCache(`profile:${userId}`);
      } else {
        this.cache.clear();
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // Private cache methods
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private getCache(key: string): unknown | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private deleteCache(key: string): void {
    this.cache.delete(key);
  }

  private getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { data?: { message?: string } } })
        .response;
      if (response?.data?.message) {
        return response.data.message;
      }
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message: string }).message;
    }
    return 'An unexpected error occurred';
  }
}
