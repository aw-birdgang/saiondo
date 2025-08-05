import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../../stores/authStore';
import { useProfileStore } from '../../../../stores/profileStore';
import type { Profile } from '../../../../domain/dto/ProfileDto';

type TabType = 'posts' | 'followers' | 'following';

interface UseProfileDataReturn {
  // 상태
  isLoading: boolean;
  isError: boolean;
  isOwnProfile: boolean;
  isEditing: boolean;
  activeTab: TabType;

  // 데이터
  profile: Profile | null;
  stats: any;
  posts: any[];
  followers: any[];
  following: any[];
  isFollowing: boolean;

  // 액션
  handleEditProfile: () => void;
  handleSaveProfile: () => void;
  handleCancelEdit: () => void;
  handleFollow: () => void;
  handleUnfollow: () => void;
  handleTabChange: (tab: TabType) => void;
  handleRefresh: () => void;
}

export const useProfileData = (userId?: string): UseProfileDataReturn => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const {
    profile,
    stats,
    posts,
    followers,
    following,
    isLoading,
    isError,
    isFollowing,
    fetchProfile,
    updateProfile,
    followUser,
    unfollowUser,
    fetchFollowers,
    fetchFollowing,
    fetchPosts,
  } = useProfileStore();

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  // 현재 사용자의 프로필인지 확인
  const isOwnProfile = user?.id === userId;

  // 프로필 데이터 로드
  useEffect(() => {
    if (userId) {
      console.log('🔍 Fetching profile for userId:', userId);
      console.log('🔐 Current user:', user);
      console.log('🔑 Token in localStorage:', localStorage.getItem('accessToken') ? 'exists' : 'missing');
      
      // 인증 확인
      if (userId === 'me' && (!token || !user)) {
        console.log('🚫 User not authenticated, redirecting to login');
        navigate('/login');
        return;
      }
      
      fetchProfile(userId);
    }
  }, [userId, fetchProfile, user, token, navigate]);

  // 탭 변경 시 해당 데이터 로드
  useEffect(() => {
    if (userId && profile) {
      switch (activeTab) {
        case 'posts':
          fetchPosts(userId);
          break;
        case 'followers':
          fetchFollowers(userId);
          break;
        case 'following':
          fetchFollowing(userId);
          break;
      }
    }
  }, [userId, activeTab, profile, fetchPosts, fetchFollowers, fetchFollowing]);

  // 편집 모드 토글
  const handleEditProfile = useCallback(() => {
    if (isOwnProfile) {
      setIsEditing(true);
    }
  }, [isOwnProfile]);

  // 프로필 저장
  const handleSaveProfile = useCallback(async () => {
    if (!profile || !isOwnProfile) return;

    try {
      await updateProfile({
        userId: profile.userId,
        displayName: profile.displayName,
        bio: profile.bio,
        avatar: profile.avatar,
        coverImage: profile.coverImage,
        location: profile.location,
        website: profile.website,
        socialLinks: profile.socialLinks,
        preferences: profile.preferences,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }, [profile, isOwnProfile, updateProfile]);

  // 편집 취소
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  // 팔로우
  const handleFollow = useCallback(async () => {
    if (!user?.id || !userId || isOwnProfile) return;

    try {
      await followUser(user.id, userId);
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  }, [user?.id, userId, isOwnProfile, followUser]);

  // 언팔로우
  const handleUnfollow = useCallback(async () => {
    if (!user?.id || !userId || isOwnProfile) return;

    try {
      await unfollowUser(user.id, userId);
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  }, [user?.id, userId, isOwnProfile, unfollowUser]);

  // 탭 변경
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // 새로고침
  const handleRefresh = useCallback(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId, fetchProfile]);

  return {
    // 상태
    isLoading,
    isError,
    isOwnProfile,
    isEditing,
    activeTab,

    // 데이터
    profile,
    stats,
    posts,
    followers,
    following,
    isFollowing,

    // 액션
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleFollow,
    handleUnfollow,
    handleTabChange,
    handleRefresh,
  };
};
