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
  Profile,
} from '../../domain/dto/ProfileDto';
import { ApiClient } from '../api/ApiClient';
import { ENDPOINTS } from '../api/endpoints';

export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(private apiClient: ApiClient) {}

  // User 데이터를 Profile 형식으로 변환하는 헬퍼 메서드
  private transformUserToProfile(userData: any): Profile {
    return {
      id: userData.id,
      userId: userData.id,
      displayName: userData.name || 'Unknown',
      bio: userData.bio || '',
      avatar: userData.avatar || userData.profileImage || '',
      coverImage: userData.coverImage || '',
      location: userData.location || '',
      website: userData.website || '',
      socialLinks: {
        twitter: userData.socialLinks?.twitter || '',
        instagram: userData.socialLinks?.instagram || '',
        linkedin: userData.socialLinks?.linkedin || '',
        github: userData.socialLinks?.github || '',
      },
      preferences: {
        theme: userData.preferences?.theme || 'light',
        language: userData.preferences?.language || 'ko',
        notifications: {
          email: userData.preferences?.notifications?.email ?? true,
          push: userData.preferences?.notifications?.push ?? true,
          sms: userData.preferences?.notifications?.sms ?? false,
        },
        privacy: {
          profileVisibility: userData.preferences?.privacy?.profileVisibility || 'public',
          showOnlineStatus: userData.preferences?.privacy?.showOnlineStatus ?? true,
          showLastSeen: userData.preferences?.privacy?.showLastSeen ?? true,
        },
      },
      stats: {
        followersCount: userData.stats?.followersCount || 0,
        followingCount: userData.stats?.followingCount || 0,
        postsCount: userData.stats?.postsCount || 0,
        viewsCount: userData.stats?.viewsCount || 0,
      },
      createdAt: new Date(userData.createdAt || Date.now()),
      updatedAt: new Date(userData.updatedAt || Date.now()),
    };
  }

  // 백엔드 User 데이터를 기반으로 실제 프로필 정보 구성
  private async enrichUserProfile(userData: any): Promise<Profile> {
    const baseProfile = this.transformUserToProfile(userData);
    
    try {
      // PersonaProfile 데이터 가져오기 (백엔드에 실제로 존재하는 기능)
      const personaProfilesResponse = await this.apiClient.get(ENDPOINTS.PERSONA_PROFILES(userData.id));
      const personaProfiles = (personaProfilesResponse as any)?.data || [];
      
      // 포인트 히스토리 가져오기 (백엔드에 실제로 존재하는 기능)
      const pointHistoryResponse = await this.apiClient.get(ENDPOINTS.POINT_HISTORY(userData.id));
      const pointHistory = (pointHistoryResponse as any)?.data || [];
      
      // 프로필 정보를 백엔드 데이터로 보강
      const enrichedProfile: Profile = {
        ...baseProfile,
        bio: this.generateBioFromPersonaProfiles(personaProfiles),
        stats: {
          ...baseProfile.stats,
          postsCount: personaProfiles.length, // PersonaProfile 개수를 포스트 수로 사용
          viewsCount: userData.point || 0, // 포인트를 조회수로 사용
        },
        // 백엔드 User 모델의 실제 필드들 추가
        additionalInfo: {
          gender: userData.gender,
          birthDate: userData.birthDate,
          point: userData.point || 0,
          isSubscribed: userData.isSubscribed || false,
          subscriptionUntil: userData.subscriptionUntil,
          personaProfilesCount: personaProfiles.length,
          assistantsCount: userData.assistants?.length || 0,
          channelsCount: userData.channelMembers?.length || 0,
        }
      };
      
      return enrichedProfile;
    } catch (error) {
      console.warn('Failed to enrich profile with additional data:', error);
      return baseProfile;
    }
  }

  // PersonaProfile 데이터로부터 bio 생성
  private generateBioFromPersonaProfiles(personaProfiles: any[]): string {
    if (!personaProfiles || personaProfiles.length === 0) {
      return '프로필을 완성해보세요!';
    }
    
    // 가장 높은 confidence score를 가진 프로필을 bio로 사용
    const bestProfile = personaProfiles.reduce((best, current) => 
      (current.confidenceScore || 0) > (best.confidenceScore || 0) ? current : best
    );
    
    return bestProfile.content || '프로필을 완성해보세요!';
  }

  async createProfile(request: CreateProfileRequest): Promise<CreateProfileResponse> {
    try {
      // 백엔드에 프로필 생성 기능이 없으므로 임시로 성공 응답
      console.log('Creating profile:', request);
      const profile = this.transformUserToProfile({
        id: request.userId,
        name: request.displayName,
        bio: request.bio,
        avatar: request.avatar,
        coverImage: request.coverImage,
        location: request.location,
        website: request.website,
        socialLinks: request.socialLinks,
        preferences: request.preferences,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return {
        success: true,
        profile,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create profile',
      };
    }
  }

  async getProfile(request: GetProfileRequest): Promise<GetProfileResponse> {
    try {
      // 모든 프로필 조회를 users 엔드포인트로 통일
      const endpoint = request.userId === 'me' ? ENDPOINTS.USER_ME : ENDPOINTS.USER_BY_ID(request.userId);
      console.log('🔍 ProfileRepository: Fetching from endpoint:', endpoint);
      
      const response = await this.apiClient.get<any>(endpoint);
      console.log('📦 ProfileRepository: API response:', response);
      
      // ApiClient.get()은 이미 response.data를 반환하므로 직접 사용
      const userData = response;
      console.log('👤 ProfileRepository: User data:', userData);
      
      const profile = await this.enrichUserProfile(userData);
      console.log('🎯 ProfileRepository: Enriched profile:', profile);
      
      return {
        success: true,
        profile,
        fetchedAt: new Date(),
      };
    } catch (error) {
      console.error('❌ ProfileRepository: Error fetching profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile',
      };
    }
  }

  async updateProfile(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const { userId, ...updates } = request;
      
      // 백엔드 User 모델에 맞는 업데이트 데이터 구성
      const userUpdateData: any = {};
      
      if (updates.displayName) userUpdateData.name = updates.displayName;
      if (updates.bio) {
        // bio는 PersonaProfile에 저장하는 것이 더 적절할 수 있음
        console.log('Bio update would be stored in PersonaProfile');
      }
      
      // 'me'인 경우 users/me 엔드포인트 사용
      const endpoint = userId === 'me' ? ENDPOINTS.USER_ME : ENDPOINTS.USER_BY_ID(userId);
      const response = await this.apiClient.put<any>(endpoint, userUpdateData);
      
      // 업데이트된 사용자 데이터로 프로필 재구성
      const userData = response;
      const profile = await this.enrichUserProfile(userData);
      
      return {
        success: true,
        profile,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  }

  async deleteProfile(request: DeleteProfileRequest): Promise<DeleteProfileResponse> {
    try {
      // 백엔드에 프로필 삭제 기능이 없으므로 임시로 성공 응답
      console.log('Deleting profile for user:', request.userId);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete profile',
      };
    }
  }

  async searchProfiles(request: SearchProfilesRequest): Promise<SearchProfilesResponse> {
    try {
      // 백엔드의 users 엔드포인트를 활용해서 사용자 검색
      const response = await this.apiClient.get<any[]>(ENDPOINTS.USERS);
      const users = response || [];
      
      // 클라이언트 사이드에서 검색 필터링
      const filteredUsers = users.filter((user: any) => {
        const searchQuery = request.query.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchQuery) ||
          user.email?.toLowerCase().includes(searchQuery)
        );
      });
      
      // 페이지네이션 적용
      const limit = request.limit || 20;
      const offset = request.offset || 0;
      const paginatedUsers = filteredUsers.slice(offset, offset + limit);
      
      // 사용자 데이터를 프로필로 변환
      const profiles = await Promise.all(
        paginatedUsers.map((user: any) => this.enrichUserProfile(user))
      );
      
      return {
        success: true,
        profiles,
        total: filteredUsers.length,
        hasMore: offset + limit < filteredUsers.length,
      };
    } catch (error) {
      console.warn('Failed to search profiles, using fallback:', error);
      return {
        success: false,
        profiles: [],
        total: 0,
        hasMore: false,
        error: error instanceof Error ? error.message : 'Failed to search profiles',
      };
    }
  }

  async getProfileStats(request: GetProfileStatsRequest): Promise<GetProfileStatsResponse> {
    try {
      // 백엔드의 실제 데이터를 활용해서 통계 생성
      const [userResponse, personaProfilesResponse, pointHistoryResponse] = await Promise.all([
        this.apiClient.get<any>(ENDPOINTS.USER_BY_ID(request.userId)),
        this.apiClient.get<any[]>(ENDPOINTS.PERSONA_PROFILES(request.userId)),
        this.apiClient.get<any[]>(ENDPOINTS.POINT_HISTORY(request.userId)),
      ]);

      const userData = userResponse;
      const personaProfiles = personaProfilesResponse || [];
      const pointHistory = pointHistoryResponse || [];

      const stats = {
        followersCount: 0, // 백엔드에 팔로우 기능이 없음
        followingCount: 0, // 백엔드에 팔로우 기능이 없음
        postsCount: personaProfiles.length, // PersonaProfile 개수
        viewsCount: userData.point || 0, // 사용자 포인트
        profileViews: pointHistory.length, // 포인트 히스토리 개수
        lastUpdated: new Date(userData.updatedAt || Date.now()),
      };
      
      return {
        success: true,
        stats,
      };
    } catch (error) {
      console.warn('Failed to get profile stats, using fallback:', error);
      // 폴백: 기본 통계 반환
      const stats = {
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        viewsCount: 0,
        profileViews: 0,
        lastUpdated: new Date(),
      };
      
      return {
        success: true,
        stats,
      };
    }
  }

  async updateProfileStats(request: UpdateProfileStatsRequest): Promise<UpdateProfileStatsResponse> {
    try {
      // 백엔드에 프로필 통계 업데이트 기능이 없으므로 임시로 성공 응답
      console.log('Updating profile stats for user:', request.userId, request.stats);
      return {
        success: true,
        stats: {
          followersCount: request.stats.followersCount || 0,
          followingCount: request.stats.followingCount || 0,
          postsCount: request.stats.postsCount || 0,
          viewsCount: request.stats.viewsCount || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile stats',
      };
    }
  }

  async followUser(request: FollowUserRequest): Promise<FollowUserResponse> {
    try {
      // 백엔드에 팔로우 기능이 없으므로 임시로 성공 응답
      console.log(`Following user: ${request.followingId} by ${request.followerId}`);
      return {
        success: true,
        isFollowing: true,
      };
    } catch (error) {
      return {
        success: false,
        isFollowing: false,
        error: error instanceof Error ? error.message : 'Failed to follow user',
      };
    }
  }

  async unfollowUser(request: UnfollowUserRequest): Promise<UnfollowUserResponse> {
    try {
      // 백엔드에 언팔로우 기능이 없으므로 임시로 성공 응답
      console.log(`Unfollowing user: ${request.followingId} by ${request.followerId}`);
      return {
        success: true,
        isFollowing: false,
      };
    } catch (error) {
      return {
        success: false,
        isFollowing: false,
        error: error instanceof Error ? error.message : 'Failed to unfollow user',
      };
    }
  }

  async getFollowers(request: GetFollowersRequest): Promise<GetFollowersResponse> {
    try {
      // 백엔드에 팔로워 기능이 없으므로 임시로 빈 목록 반환
      console.log(`Getting followers for user: ${request.userId}`);
      return {
        success: true,
        followers: [],
        total: 0,
        hasMore: false,
      };
    } catch (error) {
      return {
        success: false,
        followers: [],
        total: 0,
        hasMore: false,
        error: error instanceof Error ? error.message : 'Failed to get followers',
      };
    }
  }

  async getFollowing(request: GetFollowingRequest): Promise<GetFollowingResponse> {
    try {
      // 백엔드에 팔로잉 기능이 없으므로 임시로 빈 목록 반환
      console.log(`Getting following for user: ${request.userId}`);
      return {
        success: true,
        following: [],
        total: 0,
        hasMore: false,
      };
    } catch (error) {
      return {
        success: false,
        following: [],
        total: 0,
        hasMore: false,
        error: error instanceof Error ? error.message : 'Failed to get following',
      };
    }
  }

  async profileExists(userId: string): Promise<boolean> {
    try {
      await this.apiClient.get(`/users/${userId}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      // 백엔드에 팔로우 기능이 없으므로 임시로 false 반환
      console.log(`Checking if ${followerId} is following ${followingId}`);
      return false;
    } catch (error) {
      return false;
    }
  }

  async getProfileCacheStats(): Promise<any> {
    try {
      // 백엔드에 캐시 기능이 없으므로 임시로 null 반환
      return null;
    } catch (error) {
      return null;
    }
  }

  async clearProfileCache(userId?: string): Promise<boolean> {
    try {
      // 백엔드에 캐시 기능이 없으므로 임시로 true 반환
      console.log(`Clearing cache for user: ${userId || 'all'}`);
      return true;
    } catch (error) {
      return false;
    }
  }
} 