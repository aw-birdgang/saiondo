import type { IUserRepository } from '../repositories/IUserRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { IMessageRepository } from '../repositories/IMessageRepository';
import { DomainErrorFactory } from '../errors/DomainError';

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

export class WebSocketUseCase {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private isConnected = false;
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

  async connect(userId: string): Promise<boolean> {
    try {
      if (this.isConnected) {
        console.log('WebSocket already connected');
        return true;
      }

      console.log('Connecting to WebSocket server...');
      
      // Create WebSocket connection
      this.ws = new WebSocket(this.config.url, this.config.protocols);
      
      // Set up event handlers
      this.setupEventHandlers(userId);
      
      // Wait for connection to establish
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve(false);
        }, 10000); // 10 second timeout

        this.ws!.onopen = () => {
          clearTimeout(timeout);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.stats.totalConnections++;
          this.stats.activeConnections++;
          
          // Start heartbeat
          this.startHeartbeat();
          
          // Send authentication message
          this.sendMessage({
            type: 'auth',
            data: { userId },
            timestamp: Date.now(),
            userId,
          });
          
          this.emitEvent('open', { userId });
          resolve(true);
        };

        this.ws!.onerror = (error) => {
          clearTimeout(timeout);
          this.stats.errors++;
          this.emitEvent('error', { error, userId });
          resolve(false);
        };
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.stats.errors++;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.ws) {
        this.stopHeartbeat();
        this.stopReconnect();
        
        // Send disconnect message
        this.sendMessage({
          type: 'disconnect',
          data: {},
          timestamp: Date.now(),
        });
        
        this.ws.close();
        this.ws = null;
        this.isConnected = false;
        this.stats.activeConnections = Math.max(0, this.stats.activeConnections - 1);
        
        this.emitEvent('close', {});
      }
    } catch (error) {
      console.error('Failed to disconnect from WebSocket:', error);
    }
  }

  async sendMessage(message: WebSocketMessage): Promise<boolean> {
    try {
      if (!this.isConnected || !this.ws) {
        console.warn('WebSocket not connected, cannot send message');
        return false;
      }

      const messageStr = JSON.stringify(message);
      this.ws.send(messageStr);
      this.stats.messagesSent++;
      
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      this.stats.errors++;
      return false;
    }
  }

  async joinChannel(userId: string, channelId: string): Promise<boolean> {
    try {
      const success = await this.sendMessage({
        type: 'join_channel',
        data: { channelId },
        timestamp: Date.now(),
        userId,
        channelId,
      });

      if (success) {
        // Update connection info
        const connection = this.connections.get(userId);
        if (connection) {
          if (!connection.channels.includes(channelId)) {
            connection.channels.push(channelId);
          }
        } else {
          this.connections.set(userId, {
            id: userId,
            userId,
            connectedAt: new Date(),
            lastHeartbeat: new Date(),
            channels: [channelId],
            isActive: true,
          });
        }
      }

      return success;
    } catch (error) {
      console.error('Failed to join channel:', error);
      return false;
    }
  }

  async leaveChannel(userId: string, channelId: string): Promise<boolean> {
    try {
      const success = await this.sendMessage({
        type: 'leave_channel',
        data: { channelId },
        timestamp: Date.now(),
        userId,
        channelId,
      });

      if (success) {
        // Update connection info
        const connection = this.connections.get(userId);
        if (connection) {
          connection.channels = connection.channels.filter(id => id !== channelId);
        }
      }

      return success;
    } catch (error) {
      console.error('Failed to leave channel:', error);
      return false;
    }
  }

  async broadcastToChannel(channelId: string, message: WebSocketMessage): Promise<boolean> {
    try {
      return await this.sendMessage({
        ...message,
        channelId,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to broadcast to channel:', error);
      return false;
    }
  }

  async sendTypingIndicator(userId: string, channelId: string, isTyping: boolean): Promise<boolean> {
    try {
      return await this.sendMessage({
        type: 'typing',
        data: { isTyping },
        timestamp: Date.now(),
        userId,
        channelId,
      });
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
      return false;
    }
  }

  async sendReadReceipt(userId: string, messageId: string, channelId: string): Promise<boolean> {
    try {
      return await this.sendMessage({
        type: 'read_receipt',
        data: { messageId },
        timestamp: Date.now(),
        userId,
        channelId,
        messageId,
      });
    } catch (error) {
      console.error('Failed to send read receipt:', error);
      return false;
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

  async getConnectionInfo(userId: string): Promise<WebSocketConnection | null> {
    return this.connections.get(userId) || null;
  }

  async getActiveConnections(): Promise<WebSocketConnection[]> {
    return Array.from(this.connections.values()).filter(conn => conn.isActive);
  }

  async getWebSocketStats(): Promise<WebSocketStats> {
    return { ...this.stats };
  }

  async isConnected(): Promise<boolean> {
    return this.isConnected;
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
      this.isConnected = false;
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
      if (this.isConnected && this.ws) {
        this.sendMessage({
          type: 'heartbeat',
          data: { timestamp: Date.now() },
          timestamp: Date.now(),
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
      const success = await this.connect(userId);
      if (success) {
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