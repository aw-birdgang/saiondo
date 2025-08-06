import { useUserStore } from '@/stores/userStore';
import { useUser as useUserContext } from '@/contexts/UserContext';

export const useUser = () => {
  const userStore = useUserStore();
  const userContext = useUserContext();

  return {
    // State from Zustand store
    currentUser: userStore.currentUser,
    selectedUser: userStore.selectedUser,
    partnerUser: userStore.partnerUser,
    loading: userStore.loading,
    error: userStore.error,

    // Actions from Context
    refreshUser: userContext.refreshUser,
    updateUser: userContext.updateUser,
    // clearUser: userContext.clearUser,

    // Additional Zustand actions
    setCurrentUser: userStore.setCurrentUser,
    setSelectedUser: userStore.setSelectedUser,
    setPartnerUser: userStore.setPartnerUser,
    setLoading: userStore.setLoading,
    setError: userStore.setError,
    updateUserProfile: userStore.updateUserProfile,
    clearUserData: userStore.clearUserData,
  };
};
