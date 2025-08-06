import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { useToastContext } from '../../../providers/ToastProvider';
import { ROUTES } from '../../../../shared/constants/app';
import {
  ACTIVITY_STATS,
  RECENT_ACTIVITIES,
  QUICK_ACTIONS,
  ACCOUNT_PROGRESS_ITEMS,
  PROFILE_COMPLETION_PERCENTAGE,
} from '../constants/mypageData';
import type { MyPageState } from '../types/mypageTypes';

export const useMyPageData = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const toast = useToastContext();

  const [state, setState] = useState<MyPageState>({
    isLoading: false,
    isEditing: false,
    profileCompletion: PROFILE_COMPLETION_PERCENTAGE,
  });

  // 로그아웃 처리
  const handleLogout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      console.log('🔄 MyPage: Logging out...');
      logout();
      // 로그아웃 후 리다이렉트는 authStore에서 처리됨
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [logout, toast]);

  // 프로필 편집 모드 전환
  const handleEditProfile = useCallback(() => {
    setState(prev => ({ ...prev, isEditing: true }));
    toast.info('프로필 편집 모드로 전환되었습니다.');
  }, [toast]);

  // 프로필 저장
  const handleSaveProfile = useCallback(() => {
    setState(prev => ({ ...prev, isEditing: false }));
    toast.success('프로필이 저장되었습니다.');
  }, [toast]);

  // 편집 취소
  const handleCancelEdit = useCallback(() => {
    setState(prev => ({ ...prev, isEditing: false }));
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

  return {
    // 상태
    isLoading: state.isLoading,
    isEditing: state.isEditing,
    profileCompletion: state.profileCompletion,

    // 데이터
    activityStats: ACTIVITY_STATS,
    recentActivities: RECENT_ACTIVITIES,
    quickActions: QUICK_ACTIONS,
    accountProgressItems: ACCOUNT_PROGRESS_ITEMS,

    // 액션
    handleLogout,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleSettings,
    handleQuickActionClick,
  };
};
