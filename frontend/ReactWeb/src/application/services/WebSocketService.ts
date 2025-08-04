import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import type {IChannelRepository} from '../../domain/repositories/IChannelRepository';
import type {IMessageRepository} from '../../domain/repositories/IMessageRepository';
import type {
  BroadcastToChannelRequest,
  BroadcastToChannelResponse,
  ConnectWebSocketRequest,
  ConnectWebSocketResponse,
  DisconnectWebSocketRequest,
  DisconnectWebSocketResponse,
  JoinWebSocketChannelRequest,
  JoinWebSocketChannelResponse,
  LeaveWebSocketChannelRequest,
  LeaveWebSocketChannelResponse,
  SendWebSocketMessageRequest,
  SendWebSocketMessageResponse,
  WebSocketConfig,
  WebSocketConnection,
  WebSocketEvent,
  WebSocketMessage,
  WebSocketStats
} from '../dto/WebSocketDto';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private _isConnected = false;
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private eventHandlers = new Map<string, ((event: WebSocketEvent) => void)[]>();
  private messageHandlers = new Map<string, ((message: WebSocketMessage) => void)[]>();
  private connections = new Map<string, WebSocketConnection>();
  private stats: WebSocketStats = {
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
          if (request.token) {
            this.sendAuthMessage(request.userId, request.token);
          }

          resolve({ success: true });
        };

        this.ws!.onerror = (error) => {
          clearTimeout(timeout);
          this.stats.errors++;
          resolve({ success: false, error: 'Connection failed' });
        };
      });
    } catch (error) {
      this.stats.errors++;
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async disconnect(request: DisconnectWebSocketRequest): Promise<DisconnectWebSocketResponse> {
    try {
      if (!this._isConnected || !this.ws) {
        return { success: true };
      }

      // Stop heartbeat and reconnect timers
      this.stopHeartbeat();
      this.stopReconnect();

      // Close WebSocket connection
      this.ws.close();
      this._isConnected = false;
      this.stats.activeConnections--;

      // Remove connection from tracking
      this.connections.delete(request.userId);

      return { success: true };
    } catch (error) {
      this.stats.errors++;
      return { success: false };
    }
  }

  async sendWebSocketMessage(request: SendWebSocketMessageRequest): Promise<SendWebSocketMessageResponse> {
    try {
      if (!this._isConnected || !this.ws) {
        return { success: false, error: 'WebSocket not connected' };
      }

      const message: WebSocketMessage = {
        type: request.type || 'text',
        data: request.message,
        timestamp: Date.now(),
        userId: request.userId,
        channelId: request.channelId,
        messageId: this.generateMessageId(),
      };

      this.ws.send(JSON.stringify(message));
      this.stats.messagesSent++;

      return { success: true, messageId: message.id };
    } catch (error) {
      this.stats.errors++;
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async joinWebSocketChannel(request: JoinWebSocketChannelRequest): Promise<JoinWebSocketChannelResponse> {
    try {
      // Validate user is member of channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.userId);
      if (!isMember) {
        return { success: false, error: 'User is not a member of this channel' };
      }

      // Add user to channel connections
      const connection: WebSocketConnection = {
        id: this.generateMessageId(),
        userId: request.userId,
        connectedAt: new Date(),
        lastHeartbeat: new Date(),
        channels: [request.channelId],
        isActive: true,
      };

      this.connections.set(`${request.userId}_${request.channelId}`, connection);

      // Send join message to WebSocket server
      if (this._isConnected && this.ws) {
        const joinMessage: WebSocketMessage = {
          type: 'join_channel',
          data: '',
          timestamp: Date.now(),
          userId: request.userId,
          channelId: request.channelId,
          messageId: this.generateMessageId(),
        };

        this.ws.send(JSON.stringify(joinMessage));
      }

      return { success: true };
    } catch (error) {
      this.stats.errors++;
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async leaveWebSocketChannel(request: LeaveWebSocketChannelRequest): Promise<LeaveWebSocketChannelResponse> {
    try {
      // Remove user from channel connections
      this.connections.delete(`${request.userId}_${request.channelId}`);

      // Send leave message to WebSocket server
      if (this._isConnected && this.ws) {
        const leaveMessage: WebSocketMessage = {
          id: this.generateMessageId(),
          type: 'leave_channel',
          content: '',
          channelId: request.channelId,
          senderId: request.userId,
          timestamp: new Date(),
        };

        this.ws.send(JSON.stringify(leaveMessage));
      }

      return { success: true };
    } catch (error) {
      this.stats.errors++;
      return { success: false };
    }
  }

  async broadcastToChannel(request: BroadcastToChannelRequest): Promise<BroadcastToChannelResponse> {
    try {
      // Get all active connections for this channel
      const channelConnections = Array.from(this.connections.values())
        .filter(conn => conn.channels.includes(request.channelId) && conn.isActive)
        .filter(conn => conn.userId !== request.excludeUserId);

      const recipientsCount = channelConnections.length;

      // Send broadcast message
      if (this._isConnected && this.ws) {
        const broadcastMessage: WebSocketMessage = {
          id: this.generateMessageId(),
          type: 'broadcast',
          content: request.message,
          channelId: request.channelId,
          senderId: 'system',
          timestamp: new Date(),
        };

        this.ws.send(JSON.stringify(broadcastMessage));
        this.stats.messagesSent++;
      }

      return { success: true, recipientsCount };
    } catch (error) {
      this.stats.errors++;
      return { success: false, recipientsCount: 0 };
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

  getStats(): WebSocketStats {
    return { ...this.stats };
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  getActiveConnections(): WebSocketConnection[] {
    return Array.from(this.connections.values()).filter(conn => conn.isActive);
  }

  private setupEventHandlers(userId: string): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.emitEvent('connected', { userId });
    };

    this.ws.onclose = () => {
      this._isConnected = false;
      this.stats.activeConnections--;
      this.emitEvent('disconnected', { userId });

      // Attempt to reconnect
      if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
        this.attemptReconnect(userId);
      }
    };

    this.ws.onerror = (error) => {
      this.stats.errors++;
      this.emitEvent('error', { userId, error });
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.stats.messagesReceived++;
        this.handleMessage(message);
      } catch (error) {
        this.stats.errors++;
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    // Call type-specific handlers
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }

    // Call general message handlers
    const generalHandlers = this.messageHandlers.get('*');
    if (generalHandlers) {
      generalHandlers.forEach(handler => handler(message));
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this._isConnected && this.ws) {
        const heartbeatMessage: WebSocketMessage = {
          id: this.generateMessageId(),
          type: 'heartbeat',
          content: '',
          channelId: '',
          senderId: '',
          timestamp: new Date(),
        };

        this.ws.send(JSON.stringify(heartbeatMessage));
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

    this.reconnectTimer = setTimeout(() => {
      this.connect({ userId }).catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, this.config.reconnectInterval);
  }

  private stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private sendAuthMessage(userId: string, token: string): void {
    if (this._isConnected && this.ws) {
      const authMessage: WebSocketMessage = {
        id: this.generateMessageId(),
        type: 'auth',
        content: token,
        channelId: '',
        senderId: userId,
        timestamp: new Date(),
      };

      this.ws.send(JSON.stringify(authMessage));
    }
  }

  private emitEvent(eventType: string, data: any): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => handler({ type: eventType, data }));
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
