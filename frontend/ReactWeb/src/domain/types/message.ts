// ============================================================================
// MESSAGE TYPES
// ============================================================================

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  channelId: string;
  senderId: string;
  senderName?: string;
  createdAt: string;
  updatedAt: string;
  reactions?: MessageReaction[];
  isEdited: boolean;
  metadata?: MessageMetadata;
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
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: string;
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
