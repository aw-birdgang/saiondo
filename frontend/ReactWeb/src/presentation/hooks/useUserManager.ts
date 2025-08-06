import { useEffect, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { useUseCases } from '@/di/useDI';
import { toast } from 'react-hot-toast';

interface UseUserManagerOptions {
  autoLoad?: boolean;
  onUserLoad?: (user: any) => void;
  onUserUpdate?: (user: any) => void;
}

export const useUserManager = (options: UseUserManagerOptions = {}) => {
  const { autoLoad = true, onUserLoad, onUserUpdate } = options;

  const userStore = useUserStore();
  const { user } = useAuthStore();
  const { user: userUseCases } = useUseCases();

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      if (!user?.id) {
        console.warn('No authenticated user found');
        return;
      }

      // TODO: 실제 API 호출로 대체
      // const userData = await userUseCases.getCurrentUser();
      // userStore.setCurrentUser(userData);
      // onUserLoad?.(userData);

      // 임시로 현재 인증된 사용자 정보 사용
      if (user) {
        // userStore.setCurrentUser(user);
        onUserLoad?.(user);
        toast.success('사용자 정보를 새로고침했습니다.');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      toast.error('사용자 정보 새로고침에 실패했습니다.');
    }
  }, [user, userStore, userUseCases, onUserLoad]);

  const updateUser = useCallback(
    async (userData: any): Promise<void> => {
      try {
        if (!user?.id) {
          toast.error('로그인이 필요합니다.');
          return;
        }

        // TODO: 실제 API 호출로 대체
        // const updatedUser = await userUseCases.updateUser({
        //   ...userData,
        //   id: user.id
        // });
        // userStore.setCurrentUser(updatedUser);
        // onUserUpdate?.(updatedUser);

        // 임시로 로컬 상태 업데이트
        const updatedUser = { ...user, ...userData };
        userStore.setCurrentUser(updatedUser);
        onUserUpdate?.(updatedUser);
        toast.success('사용자 정보가 업데이트되었습니다.');
      } catch (error) {
        console.error('Failed to update user:', error);
        toast.error('사용자 정보 업데이트에 실패했습니다.');
      }
    },
    [user, userStore, userUseCases, onUserUpdate]
  );

  useEffect(() => {
    // Load user data on mount if not already loaded
    if (autoLoad && !userStore.currentUser && user?.id) {
      refreshUser();
    }
  }, [autoLoad, userStore.currentUser, user, refreshUser]);

  return {
    currentUser: userStore.currentUser,
    refreshUser,
    updateUser,
    setCurrentUser: userStore.setCurrentUser,
  };
};
