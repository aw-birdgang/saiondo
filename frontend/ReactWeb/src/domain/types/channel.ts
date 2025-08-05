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
