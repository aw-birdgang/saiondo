import { io, Socket } from 'socket.io-client';

// Types
export interface SocketMessage {
  userId: string;
  assistantId: string;
  channelId: string;
  message: string;
}

export interface SocketAIChat {
  id: string;
  userId: string;
  assistantId: string;
  channelId: string;
  message: string;
  sender: 'AI';
  createdAt: string;
}

export interface SocketResponse {
  aiChat?: SocketAIChat;
  message?: string;
  error?: string;
  status?: number;
}

export type MessageCallback = (data: SocketResponse) => void;
export type StatusCallback = (connected: boolean) => void;
export type ErrorCallback = (error: any) => void;

// Socket.IO Service Class
export class SocketService {
  private socket: Socket | null = null;
  private url: string;
  private path: string;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor(url: string = 'http://localhost:3000', path: string = '') {
    this.url = url;
    this.path = path;
  }

  // Connect to socket
  connect(
    onMessage: MessageCallback,
    onStatus: StatusCallback,
    onError?: ErrorCallback
  ): void {
    console.log('[Socket.io] connect() called');

    try {
      // Create socket connection
      this.socket = io(this.url, {
        path: this.path,
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 20000,
      });

      // Connection events
      this.socket.on('connect', () => {
        console.log('[Socket.io] Connected!');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        onStatus(true);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[Socket.io] Disconnected!', reason);
        this.isConnected = false;
        onStatus(false);
      });

      this.socket.on('connect_error', (error) => {
        console.log('[Socket.io] Connection error:', error);
        this.isConnected = false;
        onStatus(false);
        if (onError) {
          onError(error);
        }
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('[Socket.io] Reconnected after', attemptNumber, 'attempts');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        onStatus(true);
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('[Socket.io] Reconnection attempt:', attemptNumber);
        this.reconnectAttempts = attemptNumber;
      });

      this.socket.on('reconnect_failed', () => {
        console.log('[Socket.io] Reconnection failed');
        this.isConnected = false;
        onStatus(false);
        if (onError) {
          onError(new Error('Reconnection failed'));
        }
      });

      // Message events
      this.socket.off('receive_message');
      this.socket.on('receive_message', (data) => {
        console.log('[Socket.io] Received:', data);
        try {
          const response: SocketResponse = typeof data === 'string' 
            ? JSON.parse(data) 
            : data;
          onMessage(response);
        } catch (error) {
          console.error('[Socket.io] Failed to parse message:', error);
          onMessage({ message: data.toString() });
        }
      });

      // Custom error events
      this.socket.on('error', (error) => {
        console.log('[Socket.io] Custom error event:', error);
        if (onError) {
          onError(error);
        }
      });

      // Connection status
      this.socket.on('connecting', () => {
        console.log('[Socket.io] Connecting...');
        onStatus(false);
      });

      this.socket.on('connected', () => {
        console.log('[Socket.io] Connected event');
        this.isConnected = true;
        onStatus(true);
      });

    } catch (error) {
      console.error('[Socket.io] Failed to create socket connection:', error);
      if (onError) {
        onError(error);
      }
    }
  }

  // Send message
  sendMessage(userId: string, assistantId: string, channelId: string, message: string): void {
    if (!this.socket || !this.isConnected) {
      console.warn('[Socket.io] Socket not connected');
      return;
    }

    console.log('[Socket.io] sendMessage:', { userId, assistantId, message });
    
    const messageData: SocketMessage = {
      userId,
      assistantId,
      channelId,
      message,
    };

    this.socket.emit('send_message', messageData);
  }

  // Join room
  joinRoom(roomId: string): void {
    if (!this.socket || !this.isConnected) {
      console.warn('[Socket.io] Socket not connected');
      return;
    }

    console.log('[Socket.io] Joining room:', roomId);
    this.socket.emit('join_room', { roomId });
  }

  // Leave room
  leaveRoom(roomId: string): void {
    if (!this.socket || !this.isConnected) {
      console.warn('[Socket.io] Socket not connected');
      return;
    }

    console.log('[Socket.io] Leaving room:', roomId);
    this.socket.emit('leave_room', { roomId });
  }

  // Disconnect
  disconnect(): void {
    console.log('[Socket.io] disconnect() called');
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Manual reconnect
  reconnect(): void {
    if (this.socket) {
      this.socket.connect();
    }
  }

  // Update configuration
  updateConfig(url?: string, path?: string): void {
    if (url) this.url = url;
    if (path) this.path = path;
  }

  // Add custom event listener
  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove custom event listener
  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // Emit custom event
  emit(event: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }
}

// Create singleton instance
export const socketService = new SocketService(); 