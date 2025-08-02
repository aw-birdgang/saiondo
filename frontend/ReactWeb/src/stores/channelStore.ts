import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { container } from '../di/container';
import type { Channel } from '../domain/dto/ChannelDto';
import type { ChannelInvitation } from '../domain/types';

export interface Channels {
  ownedChannels: Channel[];
  memberChannels: Channel[];
}

export interface ChannelState {
  // State
  channels: Channels | null;
  currentChannel: Channel | null;
  invitations: ChannelInvitation[];
  loading: boolean;
  error: string | null;

  // Actions
  setChannels: (channels: Channels | null) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setInvitations: (invitations: ChannelInvitation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChannelData: () => void;

  // API Actions using Repository Pattern
  fetchChannelsByUserId: (userId: string) => Promise<void>;
  fetchChannelById: (channelId: string) => Promise<void>;
  createChannel: (channelData: {
    name: string;
    description?: string;
    type: 'public' | 'private' | 'direct';
    ownerId: string;
    members: string[];
  }) => Promise<void>;
  joinByInvite: (inviteCode: string, userId: string) => Promise<void>;
  leaveChannel: (channelId: string, userId: string) => Promise<void>;
  deleteChannel: (channelId: string) => Promise<void>;
  addMember: (channelId: string, userId: string) => Promise<void>;
  removeMember: (channelId: string, userId: string) => Promise<void>;
  markAsRead: (channelId: string) => Promise<void>;
}

export const useChannelStore = create<ChannelState>()(
  persist(
    (set, get) => ({
      // Initial state
      channels: null,
      currentChannel: null,
      invitations: [],
      loading: false,
      error: null,

      // Actions
      setChannels: (channels) => set({ channels }),
      setCurrentChannel: (channel) => set({ currentChannel: channel }),
      setInvitations: (invitations) => set({ invitations }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      clearChannelData: () => set({
        channels: null,
        currentChannel: null,
        invitations: [],
        error: null,
      }),

      // API Actions using Repository Pattern
      fetchChannelsByUserId: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          const channelRepository = container.getChannelRepository();
          const userChannels = await channelRepository.findByUserId(userId);
          
          // Separate owned and member channels
          const ownedChannels: Channel[] = [];
          const memberChannels: Channel[] = [];
          
          userChannels.forEach(channelEntity => {
            const channel = channelEntity.toJSON();
            if (channelEntity.isOwner(userId)) {
              ownedChannels.push(channel);
            } else {
              memberChannels.push(channel);
            }
          });
          
          set({ 
            channels: { ownedChannels, memberChannels }, 
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch channels';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchChannelById: async (channelId: string) => {
        try {
          set({ loading: true, error: null });
          const channelRepository = container.getChannelRepository();
          const channelEntity = await channelRepository.findById(channelId);
          
          if (channelEntity) {
            set({ currentChannel: channelEntity.toJSON(), loading: false });
          } else {
            set({ currentChannel: null, loading: false });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch channel';
          set({ error: errorMessage, loading: false });
        }
      },

      createChannel: async (channelData) => {
        try {
          set({ loading: true, error: null });
          const channelRepository = container.getChannelRepository();
          
          // Create channel entity
          const { ChannelEntity } = await import('../domain/entities/Channel');
          const channelEntity = ChannelEntity.create(channelData);
          
          const savedChannel = await channelRepository.save(channelEntity);
          const channel = savedChannel.toJSON();
          
          // Update local state
          const { channels } = get();
          if (channels) {
            set({ 
              channels: {
                ...channels,
                ownedChannels: [...channels.ownedChannels, channel]
              },
              loading: false 
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create channel';
          set({ error: errorMessage, loading: false });
        }
      },

      joinByInvite: async (inviteCode: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          // This would need to be implemented in the API
          // For now, we'll just refresh the channels
          await get().fetchChannelsByUserId(userId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to join channel';
          set({ error: errorMessage, loading: false });
        }
      },

      leaveChannel: async (channelId: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          const channelRepository = container.getChannelRepository();
          await channelRepository.removeMember(channelId, userId);
          
          // Refresh channels after leaving
          await get().fetchChannelsByUserId(userId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to leave channel';
          set({ error: errorMessage, loading: false });
        }
      },

      deleteChannel: async (channelId: string) => {
        try {
          set({ loading: true, error: null });
          const channelRepository = container.getChannelRepository();
          await channelRepository.delete(channelId);
          
          // Update local state
          const { channels } = get();
          if (channels) {
            set({ 
              channels: {
                ownedChannels: channels.ownedChannels.filter(c => c.id !== channelId),
                memberChannels: channels.memberChannels.filter(c => c.id !== channelId)
              },
              loading: false 
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete channel';
          set({ error: errorMessage, loading: false });
        }
      },

      addMember: async (channelId: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          const channelRepository = container.getChannelRepository();
          await channelRepository.addMember(channelId, userId);
          
          // Refresh current channel
          await get().fetchChannelById(channelId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add member';
          set({ error: errorMessage, loading: false });
        }
      },

      removeMember: async (channelId: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          const channelRepository = container.getChannelRepository();
          await channelRepository.removeMember(channelId, userId);
          
          // Refresh current channel
          await get().fetchChannelById(channelId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
          set({ error: errorMessage, loading: false });
        }
      },

      markAsRead: async (channelId: string) => {
        try {
          set({ loading: true, error: null });
          const channelRepository = container.getChannelRepository();
          await channelRepository.markAsRead(channelId);
          
          // Refresh current channel
          await get().fetchChannelById(channelId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to mark as read';
          set({ error: errorMessage, loading: false });
        }
      },
    }),
    {
      name: 'channel-storage',
      partialize: (state) => ({
        channels: state.channels,
        currentChannel: state.currentChannel,
        invitations: state.invitations,
      }),
    }
  )
); 