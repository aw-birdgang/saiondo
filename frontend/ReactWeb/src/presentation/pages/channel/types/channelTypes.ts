export interface ChannelListItem {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface ChannelStats {
  totalChannels: number;
  activeChannels: number;
  totalMessages: number;
  unreadMessages: number;
  averageResponseTime: string;
  memberCount: number;
}

export interface ChannelPageState {
  channels: ChannelListItem[];
  stats: ChannelStats;
  isLoading: boolean;
  error: string | null;
}

export interface ChannelHeaderProps {
  onCreateChannel: () => void;
  className?: string;
}

export interface ChannelStatsProps {
  stats: ChannelStats;
  className?: string;
}

export interface ChannelListProps {
  channels: ChannelListItem[];
  onChannelClick: (channelId: string) => void;
  onCreateChannel: () => void;
  className?: string;
}

export interface ChannelCardProps {
  channel: ChannelListItem;
  onClick: (channelId: string) => void;
  className?: string;
}

export interface EmptyChannelStateProps {
  onCreateChannel: () => void;
  className?: string;
} 