export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  ownerId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  members: string[];
  blockedUsers?: string[];
  maxMembers?: number;
  lastMessageAt?: Date;
  unreadCount?: number;
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: Date;
  };
  settings?: {
    allowInvites: boolean;
    allowFileUploads: boolean;
    maxMembers: number;
    autoArchive: boolean;
  };
  toJSON(): Channel;
}

// Channel 클래스 구현
export class ChannelImpl implements Channel {
  constructor(
    public id: string,
    public name: string,
    public description: string | undefined,
    public type: 'public' | 'private' | 'direct',
    public ownerId: string,
    public createdBy: string,
    public createdAt: Date,
    public updatedAt: Date,
    public members: string[],
    public blockedUsers: string[] | undefined,
    public maxMembers: number | undefined,
    public lastMessageAt: Date | undefined,
    public unreadCount: number | undefined,
    public lastMessage: {
      id: string;
      content: string;
      senderId: string;
      senderName: string;
      createdAt: Date;
    } | undefined,
    public settings: {
      allowInvites: boolean;
      allowFileUploads: boolean;
      maxMembers: number;
      autoArchive: boolean;
    } | undefined
  ) {}

  toJSON(): Channel {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      ownerId: this.ownerId,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      members: this.members,
      blockedUsers: this.blockedUsers,
      maxMembers: this.maxMembers,
      lastMessageAt: this.lastMessageAt,
      unreadCount: this.unreadCount,
      lastMessage: this.lastMessage,
      settings: this.settings,
      toJSON: this.toJSON,
    };
  }
}

export interface ChannelInvitation {
  id: string;
  channelId: string;
  inviterId: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  message?: string;
}

export interface ChannelStats {
  totalChannels: number;
  ownedChannels: number;
  memberChannels: number;
  totalMembers: number;
  activeChannels: number;
  totalMessages: number;
  todayMessages: number;
}
