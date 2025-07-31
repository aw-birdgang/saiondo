import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FirebaseApi } from '../api/firebaseApi';
import { toast } from 'react-hot-toast';

// Query Keys
export const firebaseKeys = {
  all: ['firebase'] as const,
  fcmToken: (userId: string) => [...firebaseKeys.all, 'fcm-token', userId] as const,
  fcmStatus: (userId: string) => [...firebaseKeys.all, 'fcm-status', userId] as const,
};

// Register FCM token
export const useRegisterFCMToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) => 
      FirebaseApi.registerFCMToken(userId, token),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: firebaseKeys.fcmToken(variables.userId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: firebaseKeys.fcmStatus(variables.userId) 
      });
      
      toast.success('FCM 토큰이 등록되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Unregister FCM token
export const useUnregisterFCMToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => FirebaseApi.unregisterFCMToken(userId),
    onSuccess: (data, userId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: firebaseKeys.fcmToken(userId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: firebaseKeys.fcmStatus(userId) 
      });
      
      toast.success('FCM 토큰이 삭제되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Update FCM token
export const useUpdateFCMToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) => 
      FirebaseApi.updateFCMToken(userId, token),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: firebaseKeys.fcmToken(variables.userId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: firebaseKeys.fcmStatus(variables.userId) 
      });
      
      toast.success('FCM 토큰이 업데이트되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Check FCM token status
export const useFCMTokenStatus = (userId: string) => {
  return useQuery({
    queryKey: firebaseKeys.fcmStatus(userId),
    queryFn: () => FirebaseApi.checkFCMTokenStatus(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Auto-register FCM token hook
export const useAutoRegisterFCMToken = () => {
  const registerMutation = useRegisterFCMToken();
  const updateMutation = useUpdateFCMToken();
  const statusQuery = useFCMTokenStatus('');
  
  const autoRegister = async (userId: string, token: string) => {
    try {
      // Check if token is already registered
      const status = await FirebaseApi.checkFCMTokenStatus(userId);
      
      if (status.registered) {
        // Update existing token
        await updateMutation.mutateAsync({ userId, token });
      } else {
        // Register new token
        await registerMutation.mutateAsync({ userId, token });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to auto-register FCM token:', error);
      return false;
    }
  };
  
  return {
    autoRegister,
    isRegistering: registerMutation.isPending,
    isUpdating: updateMutation.isPending,
    isLoading: statusQuery.isLoading,
  };
}; 