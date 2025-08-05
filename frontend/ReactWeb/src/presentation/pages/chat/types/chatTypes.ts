export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system' | 'emoji';
  metadata?: any;
  isRead?: boolean;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
}

export interface User {
  id: string;
  name?: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface ChatState {
  messages: Message[];
  currentUser: User | null;
  isLoading: boolean;
  searchQuery: string;
  isSearching: boolean;
  isTyping: boolean;
  typingUsers: string[];
  showEmojiPicker: boolean;
  selectedMessage: string | null;
}
