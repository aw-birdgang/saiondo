import { io, type Socket } from 'socket.io-client';

export interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: number;
}

export interface WebSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export class WebSocketClient {
  private socket: Socket | null = null;
  private url: string;
  private options: WebSocketOptions;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  constructor(url: string, options: WebSocketOptions = {}) {
    this.url = url;
    this.options = {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      ...options,
    };
  }

  connect(token?: string): void {
    if (this.socket?.connected) {
      return;
    }

    const auth = token ? { token } : {};
    
    this.socket = io(this.url, {
      ...this.options,
      auth,
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      
    });

          this.socket.on('disconnect', () => {
        
      });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // 기존 리스너들을 다시 등록
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback);
      });
    });
  }

  on(event: string, callback: (data: unknown) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: (data: unknown) => void): void {
    this.listeners.get(event)?.delete(callback);
    
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, data: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
} 