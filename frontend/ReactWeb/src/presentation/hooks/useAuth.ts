import { useAuthStore } from '../../stores/authStore';
import { useAuth as useAuthContext } from '../../contexts/AuthContext';

export const useAuth = () => {
  const authStore = useAuthStore();
  const authContext = useAuthContext();

  return {
    // State from Zustand store
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    loading: authStore.loading,
    error: authStore.error,

    // Actions from Context
    login: authContext.login,
    register: authContext.register,
    logout: authContext.logout,
    clearError: authContext.clearError,

    // Additional Zustand actions
    setUser: authStore.setUser,
    setToken: authStore.setToken,
    setLoading: authStore.setLoading,
    setError: authStore.setError,
  };
}; 