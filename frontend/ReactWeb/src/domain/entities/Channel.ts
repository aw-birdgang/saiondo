export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  ownerId: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  unreadCount?: number;
}

export class ChannelEntity {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string | undefined,
    private readonly _type: 'public' | 'private' | 'direct',
    private readonly _ownerId: string,
    private readonly _members: string[],
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _lastMessageAt: Date | undefined,
    private readonly _unreadCount: number
  ) {
    this.validate();
  }

  // Factory method
  static create(channelData: Omit<Channel, 'id' | 'createdAt' | 'updatedAt' | 'unreadCount'>): ChannelEntity {
    return new ChannelEntity(
      crypto.randomUUID(),
      channelData.name,
      channelData.description,
      channelData.type,
      channelData.ownerId,
      channelData.members,
      new Date(),
      new Date(),
      channelData.lastMessageAt,
      0
    );
  }

  static fromData(channelData: Channel): ChannelEntity {
    return new ChannelEntity(
      channelData.id,
      channelData.name,
      channelData.description,
      channelData.type,
      channelData.ownerId,
      channelData.members,
      channelData.createdAt,
      channelData.updatedAt,
      channelData.lastMessageAt,
      channelData.unreadCount || 0
    );
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new Error('Channel ID is required');
    }
    
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Channel name is required');
    }
    
    if (this._name.length > 50) {
      throw new Error('Channel name must be less than 50 characters');
    }
    
    if (this._description && this._description.length > 200) {
      throw new Error('Channel description must be less than 200 characters');
    }
    
    if (!this._ownerId || this._ownerId.trim().length === 0) {
      throw new Error('Channel owner is required');
    }
    
    if (!this._members.includes(this._ownerId)) {
      throw new Error('Channel owner must be a member');
    }
    
    if (this._type === 'direct' && this._members.length !== 2) {
      throw new Error('Direct channels must have exactly 2 members');
    }
  }

  // Business methods
  addMember(userId: string): ChannelEntity {
    if (this._members.includes(userId)) {
      throw new Error('User is already a member of this channel');
    }
    
    return new ChannelEntity(
      this._id,
      this._name,
      this._description,
      this._type,
      this._ownerId,
      [...this._members, userId],
      this._createdAt,
      new Date(),
      this._lastMessageAt,
      this._unreadCount
    );
  }

  removeMember(userId: string): ChannelEntity {
    if (!this._members.includes(userId)) {
      throw new Error('User is not a member of this channel');
    }
    
    if (userId === this._ownerId) {
      throw new Error('Cannot remove channel owner');
    }
    
    return new ChannelEntity(
      this._id,
      this._name,
      this._description,
      this._type,
      this._ownerId,
      this._members.filter(id => id !== userId),
      this._createdAt,
      new Date(),
      this._lastMessageAt,
      this._unreadCount
    );
  }

  updateLastMessage(): ChannelEntity {
    return new ChannelEntity(
      this._id,
      this._name,
      this._description,
      this._type,
      this._ownerId,
      this._members,
      this._createdAt,
      new Date(),
      new Date(),
      this._unreadCount + 1
    );
  }

  markAsRead(): ChannelEntity {
    return new ChannelEntity(
      this._id,
      this._name,
      this._description,
      this._type,
      this._ownerId,
      this._members,
      this._createdAt,
      this._updatedAt,
      this._lastMessageAt,
      0
    );
  }

  isMember(userId: string): boolean {
    return this._members.includes(userId);
  }

  isOwner(userId: string): boolean {
    return this._ownerId === userId;
  }

  canJoin(userId: string): boolean {
    if (this._type === 'private' && !this.isMember(userId)) {
      return false;
    }
    return !this.isMember(userId);
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string | undefined { return this._description; }
  get type(): 'public' | 'private' | 'direct' { return this._type; }
  get ownerId(): string { return this._ownerId; }
  get members(): string[] { return [...this._members]; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get lastMessageAt(): Date | undefined { return this._lastMessageAt; }
  get unreadCount(): number { return this._unreadCount; }

  // Data transfer
  toJSON(): Channel {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      type: this._type,
      ownerId: this._ownerId,
      members: this._members,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      lastMessageAt: this._lastMessageAt,
      unreadCount: this._unreadCount,
    };
  }
} 