import { EventEmitter } from './EventEmitter';
import { toast } from 'react-hot-toast';

export interface WebSocketMessage {
  type:
    | 'message'
    | 'typing'
    | 'user_joined'
    | 'user_left'
    | 'channel_update'
    | 'reaction'
    | 'subscribe'
    | 'unsubscribe'
    | 'ping'
    | 'pong';
  data: any;
  timestamp: number;
  senderId?: string;
  channelId?: string;
}

export interface WebSocketConfig {
  url: string;
  token: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export class WebSocketService extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;
  private isConnecting = false;
  private isConnected = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    super();
    this.config = config;
    this.maxReconnectAttempts = config.maxReconnectAttempts || 5;
    this.reconnectInterval = config.reconnectInterval || 3000;
  }

  /**
   * WebSocket 연결
   */
  async connect(): Promise<void> {
    if (this.isConnecting || this.isConnected) {
      return;
    }

    try {
      this.isConnecting = true;

      // WebSocket 연결 생성
      this.ws = new WebSocket(`${this.config.url}?token=${this.config.token}`);

      // 이벤트 리스너 설정
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.isConnecting = false;
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  /**
   * 메시지 전송
   */
  send(message: WebSocketMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Failed to send message:', error);
      this.emit('error', error);
    }
  }

  /**
   * 채널 구독
   */
  subscribeToChannel(channelId: string): void {
    this.send({
      type: 'subscribe',
      data: { channelId },
      timestamp: Date.now(),
    });
  }

  /**
   * 채널 구독 해제
   */
  unsubscribeFromChannel(channelId: string): void {
    this.send({
      type: 'unsubscribe',
      data: { channelId },
      timestamp: Date.now(),
    });
  }

  /**
   * 타이핑 상태 전송
   */
  sendTyping(channelId: string, isTyping: boolean): void {
    this.send({
      type: 'typing',
      data: { channelId, isTyping },
      timestamp: Date.now(),
    });
  }

  /**
   * 연결 상태 확인
   */
  isConnectionOpen(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 연결 열림 핸들러
   */
  private handleOpen = (event: Event): void => {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.emit('connected', event);
  };

  /**
   * 메시지 수신 핸들러
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      // 메시지 타입별 처리
      switch (message.type) {
        case 'message':
          this.emit('message', message.data);
          break;

        case 'typing':
          this.emit('typing', message.data);
          break;

        case 'user_joined':
          this.emit('user_joined', message.data);
          toast.success(`${message.data.userName}님이 참여했습니다.`);
          break;

        case 'user_left':
          this.emit('user_left', message.data);
          toast(`${message.data.userName}님이 나갔습니다.`);
          break;

        case 'channel_update':
          this.emit('channel_update', message.data);
          break;

        case 'reaction':
          this.emit('reaction', message.data);
          break;

        case 'pong':
          // 하트비트 응답
          break;

        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * 연결 종료 핸들러
   */
  private handleClose = (event: CloseEvent): void => {
    this.isConnected = false;
    this.emit('disconnected', event);

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // 자동 재연결 시도
    if (
      event.code !== 1000 &&
      this.reconnectAttempts < this.maxReconnectAttempts
    ) {
      this.scheduleReconnect();
    } else {
      toast.error('실시간 연결이 끊어졌습니다.');
    }
  };

  /**
   * 에러 핸들러
   */
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.emit('error', error);
  }

  /**
   * 자동 재연결 스케줄링
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay =
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      if (!this.isConnected && !this.isConnecting) {
        this.connect().catch(error => {
          console.error('Reconnect failed:', error);
        });
      }
    }, delay);
  }

  /**
   * 하트비트 시작
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnectionOpen()) {
        this.send({
          type: 'ping',
          data: {},
          timestamp: Date.now(),
        });
      }
    }, 30000); // 30초마다 ping
  }
}

// WebSocket 서비스 인스턴스
let wsService: WebSocketService | null = null;

/**
 * WebSocket 서비스 초기화
 */
export const initializeWebSocket = (
  config: WebSocketConfig
): WebSocketService => {
  if (wsService) {
    wsService.disconnect();
  }

  wsService = new WebSocketService(config);
  return wsService;
};

/**
 * WebSocket 서비스 가져오기
 */
export const getWebSocketService = (): WebSocketService | null => {
  return wsService;
};

/**
 * WebSocket 서비스 정리
 */
export const cleanupWebSocket = (): void => {
  if (wsService) {
    wsService.disconnect();
    wsService = null;
  }
};
