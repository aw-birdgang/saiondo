import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const authStore = useAuthStore();

  return {
    // State from Zustand store
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: !!authStore.token,
    loading: authStore.loading,
    error: authStore.error,

    // Actions from Zustand store
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    clearError: authStore.clearError,

    // Additional Zustand actions
    setUser: authStore.setUser,
    setToken: authStore.setToken,
    setLoading: authStore.setLoading,
    setError: authStore.setError,
  };
};
