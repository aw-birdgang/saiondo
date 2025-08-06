import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useIsAuthenticated } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import type { Profile } from '@/domain/dto/ProfileDto';

interface UseUnifiedProfileReturn {
  // 상태
  isLoading: boolean;
  isError: boolean;
  isEditing: boolean;
  isOwnProfile: boolean;
  activeTab: string;
  profileCompletion: number;

  // 데이터
  profile: Profile | null;
  activityStats: any[];
  recentActivities: any[];
  quickActions: any[];
  accountProgressItems: any[];

  // 액션
  handleEditProfile: () => void;
  handleSaveProfile: () => void;
  handleCancelEdit: () => void;
  handleLogout: () => void;
  handleSettings: () => void;
  handleQuickActionClick: (action: any) => void;
  handleTabChange: (tab: string) => void;
  handleRefresh: () => void;
}

export const useUnifiedProfile = (): UseUnifiedProfileReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const isAuthenticated = useIsAuthenticated();
  const toast = useToastContext();

  // Profile Store에서 데이터 가져오기
  const {
    profile,
    isLoading: profileLoading,
    isError: profileError,
    fetchProfile,
    updateProfile,
  } = useProfileStore();

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // 프로필 완성도 계산 (실제로는 백엔드에서 계산된 값 사용)
  const profileCompletion = profile ? 85 : 0; // 임시 값

  // 현재 사용자의 프로필인지 확인
  const isOwnProfile = true; // mypage에서는 항상 자신의 프로필

  // 프로필 데이터 로드
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔍 Fetching own profile for mypage');
      fetchProfile('me');
    }
  }, [fetchProfile, isAuthenticated]);

  // 로그아웃 처리
  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔄 MyPage: Logging out...');
      logout();
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [logout, toast]);

  // 프로필 편집 모드 전환
  const handleEditProfile = useCallback(() => {
    setIsEditing(true);
    toast.info('프로필 편집 모드로 전환되었습니다.');
  }, [toast]);

  // 프로필 저장
  const handleSaveProfile = useCallback(async () => {
    if (!profile) return;

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
      toast.success('프로필이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('프로필 저장 중 오류가 발생했습니다.');
    }
  }, [profile, updateProfile, toast]);

  // 편집 취소
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    toast.info('편집이 취소되었습니다.');
  }, [toast]);

  // 설정 페이지로 이동
  const handleSettings = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  // 빠른 액션 클릭 처리
  const handleQuickActionClick = useCallback(
    (action: { path: string; title: string }) => {
      navigate(action.path);
      toast.success(`${action.title}으로 이동합니다.`);
    },
    [navigate, toast]
  );

  // 탭 변경
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // 새로고침
  const handleRefresh = useCallback(() => {
    fetchProfile('me');
  }, [fetchProfile]);

  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  const activityStats = [
    { label: '총 활동', value: '127', icon: '📊', color: 'blue' },
    { label: '이번 주', value: '23', icon: '📈', color: 'green' },
    { label: '팔로워', value: '45', icon: '👥', color: 'purple' },
    { label: '팔로잉', value: '32', icon: '👤', color: 'orange' },
  ];

  const recentActivities = [
    { id: 1, type: 'post', content: '새로운 게시물을 작성했습니다.', time: '2시간 전', icon: '📝' },
    { id: 2, type: 'comment', content: '댓글을 남겼습니다.', time: '5시간 전', icon: '💬' },
    { id: 3, type: 'like', content: '게시물에 좋아요를 눌렀습니다.', time: '1일 전', icon: '❤️' },
  ];

  const quickActions = [
    { title: '새 게시물', icon: '📝', path: '/home' },
    { title: '채팅', icon: '💬', path: '/chat' },
    { title: '캘린더', icon: '📅', path: '/calendar' },
    { title: '분석', icon: '📊', path: '/analysis' },
  ];

  const accountProgressItems = [
    { label: '프로필 완성', progress: 85, icon: '👤' },
    { label: '연결된 계정', progress: 100, icon: '🔗' },
    { label: '알림 설정', progress: 60, icon: '🔔' },
    { label: '개인정보 보호', progress: 90, icon: '🔒' },
  ];

  return {
    // 상태
    isLoading: isLoading || profileLoading,
    isError: profileError,
    isEditing,
    isOwnProfile,
    activeTab,
    profileCompletion,

    // 데이터
    profile,
    activityStats,
    recentActivities,
    quickActions,
    accountProgressItems,

    // 액션
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleLogout,
    handleSettings,
    handleQuickActionClick,
    handleTabChange,
    handleRefresh,
  };
}; 