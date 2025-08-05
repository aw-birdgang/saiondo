import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Profile } from '../domain/dto/ProfileDto';
import { container } from '../di/container';
import { ProfileUseCases } from '../application/usecases/ProfileUseCases';
// ProfileUseCaseService가 삭제되었으므로 any 타입으로 대체
// type ProfileUseCaseService = any;

interface ProfileState {
  // 상태
  profile: Profile | null;
  stats: any;
  posts: any[];
  followers: any[];
  following: any[];
  isLoading: boolean;
  isError: boolean;
  isFollowing: boolean;

  // 액션
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  followUser: (followerId: string, followingId: string) => Promise<void>;
  unfollowUser: (followerId: string, followingId: string) => Promise<void>;
  fetchFollowers: (userId: string) => Promise<void>;
  fetchFollowing: (userId: string) => Promise<void>;
  fetchPosts: (userId: string) => Promise<void>;
  searchProfiles: (request: any) => Promise<any>;
  clearProfile: () => void;
  setError: (error: string | null) => void;
}

// Profile Use Cases 인스턴스 생성
const createProfileUseCases = () => {
  const profileRepository = container.getProfileRepository();
  // ProfileUseCaseService가 삭제되었으므로 mock 객체 사용
  const profileUseCaseService: any = {
    getProfile: profileRepository.getProfile,
    updateProfile: profileRepository.updateProfile,
    getProfileStats: profileRepository.getProfileStats,
    followUser: profileRepository.followUser,
    unfollowUser: profileRepository.unfollowUser,
    getFollowers: profileRepository.getFollowers,
    getFollowing: profileRepository.getFollowing,
    getPosts: async () => ({ posts: [] }),
    searchProfiles: profileRepository.searchProfiles,
  };
  return new ProfileUseCases(profileUseCaseService);
};

export const useProfileStore = create<ProfileState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      profile: null,
      stats: null,
      posts: [],
      followers: [],
      following: [],
      isLoading: false,
      isError: false,
      isFollowing: false,

      // 프로필 조회
      fetchProfile: async (userId: string) => {
        set({ isLoading: true, isError: false });

        try {
          const profileUseCases = createProfileUseCases();
          const response = await profileUseCases.getProfile({ userId });

          if (response.success && response.profile) {
            set({
              profile: response.profile,
              isLoading: false,
            });

            // 통계도 함께 로드
            const profileUseCases = createProfileUseCases();
            const statsResponse = await profileUseCases.getProfileStats({
              userId,
            });
            if (statsResponse.success && statsResponse.stats) {
              set({ stats: statsResponse.stats });
            }
          } else {
            set({
              isError: true,
              isLoading: false,
              profile: null,
            });
          }
        } catch (error) {
          set({
            isError: true,
            isLoading: false,
            profile: null,
          });
          console.error('Failed to fetch profile:', error);
        }
      },

      // 프로필 통계 조회
      fetchProfileStats: async (userId: string) => {
        try {
          const profileUseCases = createProfileUseCases();
          const response = await profileUseCases.getProfileStats({ userId });

          if (response.success && response.stats) {
            set({ stats: response.stats });
          }
        } catch (error) {
          console.error('Failed to fetch profile stats:', error);
        }
      },

      // 프로필 업데이트
      updateProfile: async (updates: Partial<Profile>) => {
        const { profile } = get();
        if (!profile) return;

        set({ isLoading: true });

        try {
          const profileUseCases = createProfileUseCases();
          const response = await profileUseCases.updateProfile({
            userId: profile.userId,
            ...updates,
          });

          if (response.success && response.profile) {
            set({
              profile: response.profile,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
            throw new Error(response.error || 'Failed to update profile');
          }
        } catch (error) {
          set({ isLoading: false });
          console.error('Failed to update profile:', error);
          throw error;
        }
      },

      // 사용자 팔로우
      followUser: async (followerId: string, followingId: string) => {
        try {
          const profileUseCases = createProfileUseCases();
          const response = await profileUseCases.followUser({
            followerId,
            followingId,
          });

          if (response.success) {
            set({ isFollowing: true });
            // 팔로워/팔로잉 목록 새로고침
            get().fetchFollowers(followingId);
            get().fetchFollowing(followerId);
          }
        } catch (error) {
          console.error('Failed to follow user:', error);
          throw error;
        }
      },

      // 사용자 언팔로우
      unfollowUser: async (followerId: string, followingId: string) => {
        try {
          const profileUseCases = createProfileUseCases();
          const response = await profileUseCases.unfollowUser({
            followerId,
            followingId,
          });

          if (response.success) {
            set({ isFollowing: false });
            // 팔로워/팔로잉 목록 새로고침
            get().fetchFollowers(followingId);
            get().fetchFollowing(followerId);
          }
        } catch (error) {
          console.error('Failed to unfollow user:', error);
          throw error;
        }
      },

      // 팔로워 목록 조회
      fetchFollowers: async (userId: string) => {
        try {
          const profileUseCases = createProfileUseCases();
          const response = await profileUseCases.getFollowers({
            userId,
            limit: 20,
            offset: 0,
          });

          if (response.success) {
            set({ followers: response.followers });
          }
        } catch (error) {
          console.error('Failed to fetch followers:', error);
        }
      },

      // 팔로잉 목록 조회
      fetchFollowing: async (userId: string) => {
        try {
          const profileUseCases = createProfileUseCases();
          const response = await profileUseCases.getFollowing({
            userId,
            limit: 20,
            offset: 0,
          });

          if (response.success) {
            set({ following: response.following });
          }
        } catch (error) {
          console.error('Failed to fetch following:', error);
        }
      },

      // 게시물 목록 조회 (임시 구현)
      fetchPosts: async (_userId: string) => {
        try {
          // TODO: 실제 게시물 API 연동
          set({ posts: [] });
        } catch (error) {
          console.error('Failed to fetch posts:', error);
        }
      },

      // 프로필 검색
      searchProfiles: async (request: any) => {
        try {
          const profileUseCases = createProfileUseCases();
          const response = await profileUseCases.searchProfiles(request);
          return response;
        } catch (error) {
          console.error('Failed to search profiles:', error);
          return {
            success: false,
            profiles: [],
            total: 0,
            hasMore: false,
            error: 'Failed to search profiles',
          };
        }
      },

      // 프로필 초기화
      clearProfile: () => {
        set({
          profile: null,
          stats: null,
          posts: [],
          followers: [],
          following: [],
          isLoading: false,
          isError: false,
          isFollowing: false,
        });
      },

      // 에러 설정
      setError: (error: string | null) => {
        set({
          isError: !!error,
          isLoading: false,
        });
      },
    }),
    {
      name: 'profile-store',
    }
  )
);
