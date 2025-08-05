// ============================================================================
// SETTINGS TYPES
// ============================================================================
export * from './settings';

// ============================================================================
// MESSAGE TYPES
// ============================================================================
export * from './message';

// ============================================================================
// USER TYPES
// ============================================================================
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

// ============================================================================
// WALLET TYPES
// ============================================================================
export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// POINT TYPES
// ============================================================================
export interface PointHistory {
  id: string;
  userId: string;
  type: 'EARN' | 'USE' | 'ADJUST';
  amount: number;
  description?: string;
  createdAt: string;
}

// ============================================================================
// CHANNEL TYPES
// ============================================================================
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

// ============================================================================
// CHANNEL INVITATION TYPES
// ============================================================================
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

// ============================================================================
// ASSISTANT TYPES
// ============================================================================
export * from './assistant';

// ============================================================================
// CHANNEL TYPES
// ============================================================================
export * from './channel';

// ============================================================================
// CATEGORY TYPES
// ============================================================================
export * from './category';

// ============================================================================
// PAYMENT TYPES
// ============================================================================
export * from './payment';

// ============================================================================
// INVITE TYPES
// ============================================================================
export * from './invite';

// ============================================================================
// MYPAGE TYPES
// ============================================================================
export * from './mypage';

// ============================================================================
// PERSONA PROFILE TYPES
// ============================================================================
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

// ============================================================================
// CHAT TYPES
// ============================================================================
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

// ============================================================================
// EVENT TYPES
// ============================================================================
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

// ============================================================================
// ANALYSIS TYPES
// ============================================================================
export * from './analysis';

// ============================================================================
// PAYMENT & SUBSCRIPTION TYPES
// ============================================================================
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

// ============================================================================
// AUTH TYPES
// ============================================================================
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

// ============================================================================
// API RESPONSE TYPES
// ============================================================================
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