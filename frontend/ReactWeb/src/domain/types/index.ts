// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  gender?: string;
  isSubscribed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithWallet extends User {
  wallet?: Wallet;
}

export interface UserWithPointHistory extends User {
  pointHistory?: PointHistory[];
}

// Wallet Types
export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

// Point Types
export interface PointHistory {
  id: string;
  userId: string;
  type: 'EARN' | 'USE' | 'ADJUST';
  amount: number;
  description?: string;
  createdAt: string;
}

// Channel Types
export interface Channel {
  id: string;
  name?: string;
  inviteCode?: string;
  createdAt: string;
  updatedAt: string;
  members?: ChannelMember[];
}

export interface ChannelMember {
  id: string;
  channelId: string;
  userId: string;
  role: 'OWNER' | 'MEMBER';
  joinedAt: string;
  user?: User;
}

export interface Channels {
  ownedChannels: Channel[];
  memberChannels: Channel[];
}

// Channel Invitation Types
export interface ChannelInvitation {
  id: string;
  channelId: string;
  inviterId: string;
  inviteeId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  channel?: Channel;
  inviter?: User;
  invitee?: User;
}

// Assistant Types
export interface Assistant {
  id: string;
  userId: string;
  name: string;
  description?: string;
  personality?: string;
  createdAt: string;
  updatedAt: string;
}

// Persona Profile Types
export interface PersonaProfile {
  id: string;
  userId: string;
  categoryCodeId: string;
  profile: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PersonaProfileRequest {
  profile: Record<string, any>;
}

// Chat Types
export interface ChatMessage {
  id: string;
  channelId?: string;
  assistantId?: string;
  userId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE';
  createdAt: string;
  user?: User;
}

export interface ChatHistory {
  id: string;
  channelId?: string;
  assistantId?: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Event Types
export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Couple Analysis Types
export interface CoupleAnalysis {
  id: string;
  channelId: string;
  analysis: Record<string, any>;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

// Advice Types
export interface Advice {
  id: string;
  channelId: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Subscription Types
export interface PaymentSubscription {
  id: string;
  userId: string;
  plan: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  gender: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 