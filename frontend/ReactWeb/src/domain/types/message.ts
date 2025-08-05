// ============================================================================
// MESSAGE TYPES
// ============================================================================

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  channelId: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  metadata?: {
    avatar?: string;
    sender?: string;
    timestamp?: Date;
    category?: string;
    tags?: string[];
    relevance?: number;
  };
  replyTo?: string;
  toJSON(): Message;
}

// Message 클래스 구현
export class MessageImpl implements Message {
  constructor(
    public id: string,
    public content: string,
    public senderId: string,
    public senderName: string,
    public channelId: string,
    public type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system',
    public createdAt: Date,
    public updatedAt: Date,
    public isRead: boolean,
    public isEdited: boolean,
    public isDeleted: boolean,
    public reactions: MessageReaction[] | undefined,
    public attachments: MessageAttachment[] | undefined,
    public metadata: {
      avatar?: string;
      sender?: string;
      timestamp?: Date;
      category?: string;
      tags?: string[];
      relevance?: number;
    } | undefined,
    public replyTo: string | undefined
  ) {}

  toJSON(): Message {
    return {
      id: this.id,
      content: this.content,
      senderId: this.senderId,
      senderName: this.senderName,
      channelId: this.channelId,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isRead: this.isRead,
      isEdited: this.isEdited,
      isDeleted: this.isDeleted,
      reactions: this.reactions,
      attachments: this.attachments,
      metadata: this.metadata,
      replyTo: this.replyTo,
      toJSON: this.toJSON,
    };
  }
}

export interface MessageRequest {
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  channelId: string;
  senderId: string;
  metadata?: MessageMetadata;
}

export interface MessageUpdateRequest {
  content?: string;
  metadata?: MessageMetadata;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ReactionRequest {
  emoji: string;
  userId: string;
}

export interface MessageMetadata {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string;
  duration?: number; // for audio/video
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file' | 'audio' | 'video';
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface MessageStats {
  totalMessages: number;
  todayMessages: number;
  averageMessagesPerDay: number;
  mostActiveHour: number;
  mostActiveDay: string;
}

export interface MessageSearchParams {
  query: string;
  channelId?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  senderId?: string;
  type?: string;
}

export interface MessageSearchResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
