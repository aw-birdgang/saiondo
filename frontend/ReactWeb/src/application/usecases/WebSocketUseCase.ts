import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  WebSocketConfig,
  WebSocketMessage,
  WebSocketConnection,
  WebSocketStats,
  WebSocketEvent,
  ConnectWebSocketRequest,
  ConnectWebSocketResponse,
  DisconnectWebSocketRequest,
  DisconnectWebSocketResponse,
  SendMessageRequest,
  SendMessageResponse,
  JoinChannelRequest,
  JoinChannelResponse,
  LeaveChannelRequest,
  LeaveChannelResponse,
  BroadcastToChannelRequest,
  BroadcastToChannelResponse,
  SendTypingIndicatorRequest,
  SendTypingIndicatorResponse,
  SendReadReceiptRequest,
  SendReadReceiptResponse,
  GetConnectionInfoRequest,
  GetConnectionInfoResponse,
  GetActiveConnectionsRequest,
  GetActiveConnectionsResponse,
  GetWebSocketStatsRequest,
  GetWebSocketStatsResponse,
  IsConnectedRequest,
  IsConnectedResponse
} from '../dto/WebSocketDto';

export class WebSocketUseCase {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private _isConnected = false;
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private eventHandlers = new Map<string, ((event: WebSocketEvent) => void)[]>();
  private messageHandlers = new Map<string, ((message: WebSocketMessage) => void)[]>();
  private connections = new Map<string, WebSocketConnection>();
  private stats = {
    totalConnections: 0,
    activeConnections: 0,
    messagesSent: 0,
    messagesReceived: 0,
    reconnections: 0,
    errors: 0,
  };

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    config: WebSocketConfig
  ) {
    this.config = {
      url: 'ws://localhost:8080',
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    };
  }

  async connect(request: ConnectWebSocketRequest): Promise<ConnectWebSocketResponse> {
    try {
      if (this._isConnected) {
        console.log('WebSocket already connected');
        return { success: true };
      }

      console.log('Connecting to WebSocket server...');
      
      // Create WebSocket connection
      this.ws = new WebSocket(this.config.url, this.config.protocols);
      
      // Set up event handlers
      this.setupEventHandlers(request.userId);
      
      // Wait for connection to establish
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve({ success: false, error: 'Connection timeout' });
        }, 10000); // 10 second timeout

        this.ws!.onopen = () => {
          clearTimeout(timeout);
          this._isConnected = true;
          this.reconnectAttempts = 0;
          this.stats.totalConnections++;
          this.stats.activeConnections++;
          
          // Start heartbeat
          this.startHeartbeat();
          
          // Send authentication message
          this.sendMessage({
            message: {
              type: 'auth',
              data: { userId: request.userId },
              timestamp: Date.now(),
              userId: request.userId,
            }
          });
          
          this.emitEvent('open', { userId: request.userId });
          resolve({ success: true, connectionId: request.userId });
        };

        this.ws!.onerror = (error) => {
          clearTimeout(timeout);
          this.stats.errors++;
          this.emitEvent('error', { error, userId: request.userId });
          resolve({ success: false, error: 'Connection failed' });
        };
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.stats.errors++;
      return { success: false, error: 'Connection failed' };
    }
  }

  async disconnect(request: DisconnectWebSocketRequest): Promise<DisconnectWebSocketResponse> {
    try {
      if (this.ws) {
        this.stopHeartbeat();
        this.stopReconnect();
        
        // Send disconnect message
        this.sendMessage({
          message: {
            type: 'disconnect',
            data: {},
            timestamp: Date.now(),
          }
        });
        
        this.ws.close();
        this.ws = null;
        this._isConnected = false;
        this.stats.activeConnections = Math.max(0, this.stats.activeConnections - 1);
        
        this.emitEvent('close', {});
        return { success: true, message: 'Disconnected successfully' };
      }
      return { success: true, message: 'Already disconnected' };
    } catch (error) {
      console.error('Failed to disconnect from WebSocket:', error);
      return { success: false, message: 'Failed to disconnect' };
    }
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      if (!this._isConnected || !this.ws) {
        console.warn('WebSocket not connected, cannot send message');
        return { success: false, error: 'Not connected' };
      }

      const messageStr = JSON.stringify(request.message);
      this.ws.send(messageStr);
      this.stats.messagesSent++;
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      this.stats.errors++;
      return { success: false, error: 'Failed to send message' };
    }
  }

  async joinChannel(request: JoinChannelRequest): Promise<JoinChannelResponse> {
    try {
      const success = await this.sendMessage({
        message: {
          type: 'join_channel',
          data: { channelId: request.channelId },
          timestamp: Date.now(),
          userId: request.userId,
          channelId: request.channelId,
        }
      });

      if (success.success) {
        // Update connection info
        const connection = this.connections.get(request.userId);
        if (connection) {
          if (!connection.channels.includes(request.channelId)) {
            connection.channels.push(request.channelId);
          }
        } else {
          this.connections.set(request.userId, {
            id: request.userId,
            userId: request.userId,
            connectedAt: new Date(),
            lastHeartbeat: new Date(),
            channels: [request.channelId],
            isActive: true,
          });
        }
      }

      return success;
    } catch (error) {
      console.error('Failed to join channel:', error);
      return { success: false, error: 'Failed to join channel' };
    }
  }

  async leaveChannel(request: LeaveChannelRequest): Promise<LeaveChannelResponse> {
    try {
      const success = await this.sendMessage({
        message: {
          type: 'leave_channel',
          data: { channelId: request.channelId },
          timestamp: Date.now(),
          userId: request.userId,
          channelId: request.channelId,
        }
      });

      if (success.success) {
        // Update connection info
        const connection = this.connections.get(request.userId);
        if (connection) {
          connection.channels = connection.channels.filter(id => id !== request.channelId);
        }
      }

      return success;
    } catch (error) {
      console.error('Failed to leave channel:', error);
      return { success: false, error: 'Failed to leave channel' };
    }
  }

  async broadcastToChannel(request: BroadcastToChannelRequest): Promise<BroadcastToChannelResponse> {
    try {
      const success = await this.sendMessage({
        message: {
          ...request.message,
          channelId: request.channelId,
          timestamp: Date.now(),
        }
      });
      return success;
    } catch (error) {
      console.error('Failed to broadcast to channel:', error);
      return { success: false, error: 'Failed to broadcast' };
    }
  }

  async sendTypingIndicator(request: SendTypingIndicatorRequest): Promise<SendTypingIndicatorResponse> {
    try {
      const success = await this.sendMessage({
        message: {
          type: 'typing',
          data: { isTyping: request.isTyping },
          timestamp: Date.now(),
          userId: request.userId,
          channelId: request.channelId,
        }
      });
      return success;
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
      return { success: false, error: 'Failed to send typing indicator' };
    }
  }

  async sendReadReceipt(request: SendReadReceiptRequest): Promise<SendReadReceiptResponse> {
    try {
      const success = await this.sendMessage({
        message: {
          type: 'read_receipt',
          data: { messageId: request.messageId },
          timestamp: Date.now(),
          userId: request.userId,
          channelId: request.channelId,
          messageId: request.messageId,
        }
      });
      return success;
    } catch (error) {
      console.error('Failed to send read receipt:', error);
      return { success: false, error: 'Failed to send read receipt' };
    }
  }

  onMessage(type: string, handler: (message: WebSocketMessage) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  onEvent(eventType: string, handler: (event: WebSocketEvent) => void): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  async getConnectionInfo(request: GetConnectionInfoRequest): Promise<GetConnectionInfoResponse> {
    return { connection: this.connections.get(request.userId) || null };
  }

  async getActiveConnections(request: GetActiveConnectionsRequest): Promise<GetActiveConnectionsResponse> {
    return { connections: Array.from(this.connections.values()).filter(conn => conn.isActive) };
  }

  async getWebSocketStats(request: GetWebSocketStatsRequest): Promise<GetWebSocketStatsResponse> {
    return { stats: { ...this.stats } };
  }

  async checkConnectionStatus(request: IsConnectedRequest): Promise<IsConnectedResponse> {
    return { connected: this._isConnected };
  }

  private setupEventHandlers(userId: string): void {
    if (!this.ws) return;

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.stats.messagesReceived++;
        
        // Update connection heartbeat
        const connection = this.connections.get(userId);
        if (connection) {
          connection.lastHeartbeat = new Date();
        }
        
        // Call message handlers
        const handlers = this.messageHandlers.get(message.type);
        if (handlers) {
          handlers.forEach(handler => {
            try {
              handler(message);
            } catch (error) {
              console.error('Error in message handler:', error);
            }
          });
        }
        
        // Call general message handlers
        const generalHandlers = this.messageHandlers.get('*');
        if (generalHandlers) {
          generalHandlers.forEach(handler => {
            try {
              handler(message);
            } catch (error) {
              console.error('Error in general message handler:', error);
            }
          });
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
        this.stats.errors++;
      }
    };

    this.ws.onclose = (event) => {
      this._isConnected = false;
      this.stats.activeConnections = Math.max(0, this.stats.activeConnections - 1);
      this.stopHeartbeat();
      
      this.emitEvent('close', { code: event.code, reason: event.reason });
      
      // Attempt to reconnect if not a normal closure
      if (event.code !== 1000 && this.reconnectAttempts < this.config.maxReconnectAttempts!) {
        this.attemptReconnect(userId);
      }
    };

    this.ws.onerror = (error) => {
      this.stats.errors++;
      this.emitEvent('error', { error });
    };
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.heartbeatTimer = setInterval(() => {
      if (this._isConnected && this.ws) {
        this.sendMessage({
          message: {
            type: 'heartbeat',
            data: { timestamp: Date.now() },
            timestamp: Date.now(),
          }
        });
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private attemptReconnect(userId: string): void {
    this.reconnectAttempts++;
    this.stats.reconnections++;
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`);
    
    this.reconnectTimer = setTimeout(async () => {
      const success = await this.connect({ userId });
      if (success.success) {
        this.emitEvent('reconnect', { attempt: this.reconnectAttempts });
      }
    }, this.config.reconnectInterval);
  }

  private stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private emitEvent(eventType: string, data: any): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const event: WebSocketEvent = {
        type: eventType as any,
        data,
        timestamp: new Date(),
      };
      
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }
} 