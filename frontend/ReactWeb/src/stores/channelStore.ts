import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { channelService } from '../infrastructure/api/services/channelService';
import type { Channel, Channels, ChannelInvitation } from '../domain/types';

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

  // API Actions
  fetchChannelsByUserId: (userId: string) => Promise<void>;
  fetchChannelById: (channelId: string) => Promise<void>;
  createChannel: (userId: string) => Promise<void>;
  joinByInvite: (inviteCode: string, userId: string) => Promise<void>;
  leaveChannel: (userId: string) => Promise<void>;
  deleteChannel: (channelId: string) => Promise<void>;
  createInviteCode: (channelId: string, userId: string) => Promise<string>;
  fetchInvitationsForUser: (userId: string) => Promise<void>;
  respondInvitation: (invitationId: string, response: 'ACCEPT' | 'REJECT') => Promise<void>;
  createInvitation: (channelId: string, inviterId: string, inviteeId: string) => Promise<void>;
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

      // API Actions
      fetchChannelsByUserId: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          const channels = await channelService.fetchChannelsByUserId(userId);
          set({ channels, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch channels';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchChannelById: async (channelId: string) => {
        try {
          set({ loading: true, error: null });
          const channel = await channelService.fetchChannelById(channelId);
          set({ currentChannel: channel, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch channel';
          set({ error: errorMessage, loading: false });
        }
      },

      createChannel: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          const newChannel = await channelService.createChannel(userId);
          const { channels } = get();
          if (channels) {
            set({ 
              channels: {
                ...channels,
                ownedChannels: [...channels.ownedChannels, newChannel]
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
          const channel = await channelService.joinByInvite(inviteCode, userId);
          const { channels } = get();
          if (channels) {
            set({ 
              channels: {
                ...channels,
                memberChannels: [...channels.memberChannels, channel]
              },
              loading: false 
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to join channel';
          set({ error: errorMessage, loading: false });
        }
      },

      leaveChannel: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          await channelService.leaveChannel(userId);
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
          await channelService.deleteChannel(channelId);
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

      createInviteCode: async (channelId: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          const result = await channelService.createInviteCode(channelId, userId);
          set({ loading: false });
          return result.inviteCode;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create invite code';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      fetchInvitationsForUser: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          const invitations = await channelService.fetchInvitationsForUser(userId);
          set({ invitations, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invitations';
          set({ error: errorMessage, loading: false });
        }
      },

      respondInvitation: async (invitationId: string, response: 'ACCEPT' | 'REJECT') => {
        try {
          set({ loading: true, error: null });
          await channelService.respondInvitation(invitationId, response);
          // Remove the invitation from the list
          const { invitations } = get();
          set({ 
            invitations: invitations.filter(inv => inv.id !== invitationId),
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to respond to invitation';
          set({ error: errorMessage, loading: false });
        }
      },

      createInvitation: async (channelId: string, inviterId: string, inviteeId: string) => {
        try {
          set({ loading: true, error: null });
          await channelService.createInvitation(channelId, inviterId, inviteeId);
          set({ loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create invitation';
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