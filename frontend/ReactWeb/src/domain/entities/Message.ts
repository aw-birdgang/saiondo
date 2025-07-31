export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  channelId: string;
  senderId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  replyTo?: string;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
} 