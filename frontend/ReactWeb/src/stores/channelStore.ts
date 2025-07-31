import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChannelMember {
  id: string;
  userId: string;
  channelId: string;
  role: 'admin' | 'member' | 'moderator';
  joinedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  createdAt: Date;
  updatedAt: Date;
  members: ChannelMember[];
  lastMessage?: {
    id: string;
    content: string;
    createdAt: Date;
    senderId: string;
  };
}

export interface ChannelState {
  // State
  channels: Channel[];
  currentChannel: Channel | null;
  loading: boolean;
  error: string | null;

  // Actions
  setChannels: (channels: Channel[]) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  removeChannel: (channelId: string) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addMember: (channelId: string, member: ChannelMember) => void;
  removeMember: (channelId: string, userId: string) => void;
  updateLastMessage: (channelId: string, message: Channel['lastMessage']) => void;
}

export const useChannelStore = create<ChannelState>()(
  persist(
    (set, get) => ({
      // Initial state
      channels: [],
      currentChannel: null,
      loading: false,
      error: null,

      // Actions
      setChannels: (channels) => set({ channels }),
      
      addChannel: (channel) => set((state) => ({
        channels: [...state.channels, channel],
      })),
      
      updateChannel: (channelId, updates) => set((state) => ({
        channels: state.channels.map((channel) =>
          channel.id === channelId ? { ...channel, ...updates } : channel
        ),
        currentChannel: state.currentChannel?.id === channelId
          ? { ...state.currentChannel, ...updates }
          : state.currentChannel,
      })),
      
      removeChannel: (channelId) => set((state) => ({
        channels: state.channels.filter((channel) => channel.id !== channelId),
        currentChannel: state.currentChannel?.id === channelId
          ? null
          : state.currentChannel,
      })),
      
      setCurrentChannel: (channel) => set({ currentChannel: channel }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      addMember: (channelId, member) => set((state) => ({
        channels: state.channels.map((channel) =>
          channel.id === channelId
            ? { ...channel, members: [...channel.members, member] }
            : channel
        ),
        currentChannel: state.currentChannel?.id === channelId
          ? { ...state.currentChannel, members: [...state.currentChannel.members, member] }
          : state.currentChannel,
      })),
      
      removeMember: (channelId, userId) => set((state) => ({
        channels: state.channels.map((channel) =>
          channel.id === channelId
            ? { ...channel, members: channel.members.filter((m) => m.userId !== userId) }
            : channel
        ),
        currentChannel: state.currentChannel?.id === channelId
          ? { ...state.currentChannel, members: state.currentChannel.members.filter((m) => m.userId !== userId) }
          : state.currentChannel,
      })),
      
      updateLastMessage: (channelId, message) => set((state) => ({
        channels: state.channels.map((channel) =>
          channel.id === channelId ? { ...channel, lastMessage: message } : channel
        ),
        currentChannel: state.currentChannel?.id === channelId
          ? { ...state.currentChannel, lastMessage: message }
          : state.currentChannel,
      })),
    }),
    {
      name: 'channel-storage',
      partialize: (state) => ({
        channels: state.channels,
        currentChannel: state.currentChannel,
      }),
    }
  )
); 