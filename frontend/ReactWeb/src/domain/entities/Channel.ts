export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  members: ChannelMember[];
  settings: ChannelSettings;
}

export interface ChannelMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  permissions: ChannelPermissions;
}

export interface ChannelPermissions {
  canInvite: boolean;
  canDelete: boolean;
  canEdit: boolean;
  canManageMembers: boolean;
}

export interface ChannelSettings {
  allowInvites: boolean;
  requireApproval: boolean;
  maxMembers?: number;
} 