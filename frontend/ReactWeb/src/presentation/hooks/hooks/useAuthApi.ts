import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthApi, type LoginRequest, type RegisterRequest, type AuthResponse } from '../api/authApi';
import { toast } from 'react-hot-toast';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  profile: (userId: string) => [...authKeys.all, 'profile', userId] as const,
  verify: () => [...authKeys.all, 'verify'] as const,
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password }: LoginRequest) => 
      AuthApi.login(email, password),
    onSuccess: (data: AuthResponse) => {
      // Store auth data
      localStorage.setItem('auth_token', data.accessToken);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      localStorage.setItem('user_id', data.user.id);
      
      // Update auth store
      queryClient.setQueryData(authKeys.all, data);
      
      toast.success('로그인 성공!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password, name, gender }: RegisterRequest) => 
      AuthApi.register(email, password, name, gender),
    onSuccess: (data: AuthResponse) => {
      // Store auth data
      localStorage.setItem('auth_token', data.accessToken);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      localStorage.setItem('user_id', data.user.id);
      
      // Update auth store
      queryClient.setQueryData(authKeys.all, data);
      
      toast.success('회원가입 성공!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => AuthApi.logout(),
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_id');
      
      // Clear all queries
      queryClient.clear();
      
      toast.success('로그아웃되었습니다.');
    },
    onError: (error: Error) => {
      // Even if API call fails, clear local data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_id');
      queryClient.clear();
      
      toast.success('로그아웃되었습니다.');
    },
  });
};

// Token verification
export const useVerifyToken = () => {
  return useQuery({
    queryKey: authKeys.verify(),
    queryFn: () => AuthApi.verifyToken(),
    enabled: !!localStorage.getItem('auth_token'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user profile
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: authKeys.profile(userId),
    queryFn: () => AuthApi.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<{ name: string; gender: string }> }) => 
      AuthApi.updateProfile(userId, data),
    onSuccess: (data, variables) => {
      // Update profile in cache
      queryClient.setQueryData(authKeys.profile(variables.userId), data);
      
      // Update user data in localStorage
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = { ...user, ...data };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      }
      
      toast.success('프로필이 업데이트되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Password reset request
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => AuthApi.requestPasswordReset(email),
    onSuccess: () => {
      toast.success('비밀번호 재설정 이메일이 전송되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Password reset
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) => 
      AuthApi.resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success('비밀번호가 재설정되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}; 