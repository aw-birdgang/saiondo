import { useEffect, useCallback } from 'react';
import { useChannelStore } from '../../stores/channelStore';
import { useAuthStore } from '../../stores/authStore';
import { useUseCases } from '../../app/di';
import { toast } from 'react-hot-toast';

// 임시 API 함수들 (실제 구현 시 교체)
const channelApi = {
  loadChannels: async (userId: string, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`/api/channels/user/${userId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 임시 채널 데이터
    return {
      ownedChannels: [
        {
          id: crypto.randomUUID(),
          name: '커플 상담실',
          description: '연인 관계 상담을 위한 채널입니다.',
          type: 'private' as const,
          createdBy: userId,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
          updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
          members: [userId, 'partner-user-id'],
          lastMessage: {
            id: crypto.randomUUID(),
            content: '안녕하세요! 상담을 시작하겠습니다.',
            senderId: 'ai-assistant',
            senderName: 'AI 상담사',
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
          }
        }
      ],
      memberChannels: [
        {
          id: crypto.randomUUID(),
          name: '감정 공유방',
          description: '감정을 나누고 공유하는 채널입니다.',
          type: 'public' as const,
          createdBy: 'other-user-id',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1주일 전
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
          members: ['other-user-id', userId, 'another-user-id'],
          lastMessage: {
            id: crypto.randomUUID(),
            content: '오늘 기분이 좋아요!',
            senderId: 'another-user-id',
            senderName: '다른 사용자',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          }
        }
      ]
    };
  },

  createChannel: async (channelData: {
    name: string;
    description?: string;
    type: 'public' | 'private' | 'direct';
    ownerId: string;
    members: string[];
  }, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch('/api/channels', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(channelData)
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: crypto.randomUUID(),
      name: channelData.name,
      description: channelData.description,
      type: channelData.type,
      createdBy: channelData.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: channelData.members,
      lastMessage: undefined,
    };
  },

  updateChannel: async (channelId: string, updates: {
    name?: string;
    description?: string;
  }, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`/api/channels/${channelId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(updates)
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  },

  deleteChannel: async (channelId: string, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`/api/channels/${channelId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  }
};

export const useChannels = () => {
  const channelStore = useChannelStore();
  const { user, token } = useAuthStore();
  const { channelUseCases } = useUseCases();
  
  const loadChannels = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      // 실제 API 호출
      const channels = await channelApi.loadChannels(user.id, token || '');
      channelStore.setChannels(channels);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load channels';
      channelStore.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      channelStore.setLoading(false);
    }
  }, [user, token, channelStore]);

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
      
      // 실제 API 호출
      const channel = await channelApi.createChannel({
        ...channelData,
        ownerId: user.id,
        members: [user.id]
      }, token || '');
      
      // 로컬 상태 업데이트
      const currentChannels = channelStore.channels;
      if (currentChannels) {
        channelStore.setChannels({
          ...currentChannels,
          ownedChannels: [...currentChannels.ownedChannels, channel]
        });
      }
      
      toast.success('Channel created successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create channel';
      channelStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      channelStore.setLoading(false);
    }
  }, [user, token, channelStore]);

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
      
      // 실제 API 호출
      await channelApi.updateChannel(channelId, updates, token || '');
      
      // 로컬 상태 업데이트
      const currentChannels = channelStore.channels;
      if (currentChannels) {
        const updatedOwnedChannels = currentChannels.ownedChannels.map(channel =>
          channel.id === channelId ? { ...channel, ...updates, updatedAt: new Date() } : channel
        );
        const updatedMemberChannels = currentChannels.memberChannels.map(channel =>
          channel.id === channelId ? { ...channel, ...updates, updatedAt: new Date() } : channel
        );
        
        channelStore.setChannels({
          ownedChannels: updatedOwnedChannels,
          memberChannels: updatedMemberChannels
        });
      }
      
      toast.success('Channel updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update channel';
      channelStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      channelStore.setLoading(false);
    }
  }, [user, token, channelStore]);

  const deleteChannel = useCallback(async (channelId: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      // 실제 API 호출
      await channelApi.deleteChannel(channelId, token || '');
      
      // 로컬 상태 업데이트
      const currentChannels = channelStore.channels;
      if (currentChannels) {
        channelStore.setChannels({
          ownedChannels: currentChannels.ownedChannels.filter(c => c.id !== channelId),
          memberChannels: currentChannels.memberChannels.filter(c => c.id !== channelId)
        });
      }
      
      toast.success('Channel deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete channel';
      channelStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      channelStore.setLoading(false);
    }
  }, [user, token, channelStore]);

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