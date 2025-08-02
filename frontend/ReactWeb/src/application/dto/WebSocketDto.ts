/**
 * WebSocket Use Case DTOs
 * WebSocket 관련 Request/Response 인터페이스
 */

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  userId?: string;
  channelId?: string;
  messageId?: string;
}

export interface WebSocketConnection {
  id: string;
  userId: string;
  connectedAt: Date;
  lastHeartbeat: Date;
  channels: string[];
  isActive: boolean;
}

export interface WebSocketStats {
  totalConnections: number;
  activeConnections: number;
  messagesSent: number;
  messagesReceived: number;
  reconnections: number;
  errors: number;
}

export interface WebSocketEvent {
  type: 'open' | 'message' | 'close' | 'error' | 'reconnect';
  data?: any;
  timestamp: Date;
}

export interface ConnectWebSocketRequest {
  userId: string;
  config?: Partial<WebSocketConfig>;
}

export interface ConnectWebSocketResponse {
  success: boolean;
  connectionId?: string;
  error?: string;
}

export interface DisconnectWebSocketRequest {
  userId: string;
}

export interface DisconnectWebSocketResponse {
  success: boolean;
  message: string;
}

export interface SendWebSocketMessageRequest {
  message: WebSocketMessage;
}

export interface SendWebSocketMessageResponse {
  success: boolean;
  error?: string;
}

export interface JoinWebSocketChannelRequest {
  userId: string;
  channelId: string;
}

export interface JoinWebSocketChannelResponse {
  success: boolean;
  error?: string;
}

export interface LeaveWebSocketChannelRequest {
  userId: string;
  channelId: string;
}

export interface LeaveWebSocketChannelResponse {
  success: boolean;
  error?: string;
}

export interface BroadcastToChannelRequest {
  channelId: string;
  message: WebSocketMessage;
}

export interface BroadcastToChannelResponse {
  success: boolean;
  error?: string;
}

export interface SendTypingIndicatorRequest {
  userId: string;
  channelId: string;
  isTyping: boolean;
}

export interface SendTypingIndicatorResponse {
  success: boolean;
  error?: string;
}

export interface SendReadReceiptRequest {
  userId: string;
  messageId: string;
  channelId: string;
}

export interface SendReadReceiptResponse {
  success: boolean;
  error?: string;
}

export interface GetConnectionInfoRequest {
  userId: string;
}

export interface GetConnectionInfoResponse {
  connection: WebSocketConnection | null;
}

export interface GetActiveConnectionsRequest {
  // No specific parameters needed
}

export interface GetActiveConnectionsResponse {
  connections: WebSocketConnection[];
}

export interface GetWebSocketStatsRequest {
  // No specific parameters needed
}

export interface GetWebSocketStatsResponse {
  stats: WebSocketStats;
}

export interface IsConnectedRequest {
  // No specific parameters needed
}

export interface IsConnectedResponse {
  connected: boolean;
} 