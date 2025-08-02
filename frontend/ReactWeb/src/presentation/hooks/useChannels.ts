import { useEffect, useCallback } from 'react';
import { useChannelStore } from '../../stores/channelStore';
import { useAuthStore } from '../../stores/authStore';
import { useUseCases } from '../../app/di';
import { toast } from 'react-hot-toast';

export const useChannels = () => {
  const channelStore = useChannelStore();
  const { user } = useAuthStore();
  const { channelUseCases } = useUseCases();
  
  const loadChannels = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      // TODO: 실제 API 호출로 대체
      // const channels = await channelUseCases.loadChannels();
      // channelStore.setChannels(channels);
      
      // 임시로 빈 채널 구조 설정
      channelStore.setChannels({
        ownedChannels: [],
        memberChannels: []
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load channels';
      channelStore.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      channelStore.setLoading(false);
    }
  }, [user, channelStore, channelUseCases]);

  const createChannel = useCallback(async (channelData: { 
    name: string; 
    description?: string; 
    type: 'public' | 'private' | 'direct' 
  }) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      // TODO: 실제 API 호출로 대체
      // const channel = await channelUseCases.createChannel({
      //   ...channelData,
      //   createdBy: user.id,
      // });
      
      // 채널 스토어의 createChannel 메서드 사용
      await channelStore.createChannel({
        ...channelData,
        ownerId: user.id,
        members: [user.id]
      });
      
      toast.success('Channel created successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create channel';
      channelStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      channelStore.setLoading(false);
    }
  }, [user, channelStore, channelUseCases]);

  const updateChannel = useCallback(async (channelId: string, updates: { 
    name?: string; 
    description?: string 
  }) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      // TODO: 실제 API 호출로 대체
      // await channelUseCases.updateChannel(channelId, updates);
      
      // 채널 업데이트 로직은 스토어에서 처리
      toast.success('Channel updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update channel';
      channelStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      channelStore.setLoading(false);
    }
  }, [user, channelStore, channelUseCases]);

  const deleteChannel = useCallback(async (channelId: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      // TODO: 실제 API 호출로 대체
      // await channelUseCases.deleteChannel(channelId);
      
      await channelStore.deleteChannel(channelId);
      toast.success('Channel deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete channel';
      channelStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      channelStore.setLoading(false);
    }
  }, [user, channelStore, channelUseCases]);

  // Load channels on mount
  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  return {
    // State
    channels: channelStore.channels,
    currentChannel: channelStore.currentChannel,
    loading: channelStore.loading,
    error: channelStore.error,

    // Actions
    loadChannels,
    createChannel,
    updateChannel,
    deleteChannel,
    setCurrentChannel: channelStore.setCurrentChannel,
    setLoading: channelStore.setLoading,
    setError: channelStore.setError,
  };
}; 