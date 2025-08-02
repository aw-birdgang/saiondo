import { useEffect } from 'react';
import { useChannelStore } from '../../stores/channelStore';
import { useUseCases } from '../../app/di';

export const useChannels = () => {
  const channelStore = useChannelStore();
  const { channelUseCases } = useUseCases();
  
  const loadChannels = async () => {
    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      // For now, just set empty array to avoid type conflicts
      channelStore.setChannels([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load channels';
      channelStore.setError(errorMessage);
    } finally {
      channelStore.setLoading(false);
    }
  };

  const createChannel = async (channelData: { name: string; description?: string; type: 'public' | 'private' | 'direct' }) => {
    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      // For now, just create a mock channel
      const mockChannel = {
        id: Math.random().toString(36).substr(2, 9),
        name: channelData.name,
        description: channelData.description,
        type: channelData.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [],
        lastMessage: undefined,
      };
      
      channelStore.addChannel(mockChannel);
      return mockChannel;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create channel';
      channelStore.setError(errorMessage);
      throw err;
    } finally {
      channelStore.setLoading(false);
    }
  };

  const updateChannel = async (channelId: string, updates: { name?: string; description?: string }) => {
    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      channelStore.updateChannel(channelId, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update channel';
      channelStore.setError(errorMessage);
      throw err;
    } finally {
      channelStore.setLoading(false);
    }
  };

  const deleteChannel = async (channelId: string) => {
    try {
      channelStore.setLoading(true);
      channelStore.setError(null);
      
      channelStore.removeChannel(channelId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete channel';
      channelStore.setError(errorMessage);
      throw err;
    } finally {
      channelStore.setLoading(false);
    }
  };

  // Load channels on mount
  useEffect(() => {
    loadChannels();
  }, []);

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