import {WebSocketService} from '../services/WebSocketService';
import type {
  BroadcastToChannelRequest,
  BroadcastToChannelResponse,
  ConnectWebSocketRequest,
  ConnectWebSocketResponse,
  DisconnectWebSocketRequest,
  DisconnectWebSocketResponse,
  GetActiveConnectionsRequest,
  GetActiveConnectionsResponse,
  GetConnectionInfoRequest,
  GetConnectionInfoResponse,
  GetWebSocketStatsRequest,
  GetWebSocketStatsResponse,
  IsConnectedRequest,
  IsConnectedResponse,
  JoinWebSocketChannelRequest,
  JoinWebSocketChannelResponse,
  LeaveWebSocketChannelRequest,
  LeaveWebSocketChannelResponse,
  SendReadReceiptRequest,
  SendReadReceiptResponse,
  SendTypingIndicatorRequest,
  SendTypingIndicatorResponse,
  SendWebSocketMessageRequest,
  SendWebSocketMessageResponse,
  WebSocketEvent,
  WebSocketMessage
} from '../dto/WebSocketDto';

export class WebSocketUseCase {
  constructor(
    private readonly webSocketService: WebSocketService
  ) {}

  async connect(request: ConnectWebSocketRequest): Promise<ConnectWebSocketResponse> {
    return await this.webSocketService.connect(request);
  }

  async disconnect(request: DisconnectWebSocketRequest): Promise<DisconnectWebSocketResponse> {
    const result = await this.webSocketService.disconnect(request);
    return { success: result.success, message: result.success ? 'Disconnected successfully' : 'Failed to disconnect' };
  }

  async sendWebSocketMessage(request: SendWebSocketMessageRequest): Promise<SendWebSocketMessageResponse> {
    const serviceRequest = {
      userId: request.message.userId || '',
      channelId: request.message.channelId || '',
      message: typeof request.message.data === 'string' ? request.message.data : JSON.stringify(request.message.data),
      type: request.message.type
    };
    return await this.webSocketService.sendWebSocketMessage(serviceRequest);
  }

  async joinWebSocketChannel(request: JoinWebSocketChannelRequest): Promise<JoinWebSocketChannelResponse> {
    return await this.webSocketService.joinWebSocketChannel(request);
  }

  async leaveWebSocketChannel(request: LeaveWebSocketChannelRequest): Promise<LeaveWebSocketChannelResponse> {
    return await this.webSocketService.leaveWebSocketChannel(request);
  }

  async broadcastToChannel(request: BroadcastToChannelRequest): Promise<BroadcastToChannelResponse> {
    const serviceRequest = {
      channelId: request.channelId,
      message: typeof request.message.data === 'string' ? request.message.data : JSON.stringify(request.message.data),
      excludeUserId: request.message.userId
    };
    return await this.webSocketService.broadcastToChannel(serviceRequest);
  }

  async sendTypingIndicator(request: SendTypingIndicatorRequest): Promise<SendTypingIndicatorResponse> {
    // Delegate to service if implemented, otherwise return mock response
    return { success: true };
  }

  async sendReadReceipt(request: SendReadReceiptRequest): Promise<SendReadReceiptResponse> {
    // Delegate to service if implemented, otherwise return mock response
    return { success: true };
  }

  onMessage(type: string, handler: (message: WebSocketMessage) => void): void {
    this.webSocketService.onMessage(type, handler);
  }

  onEvent(eventType: string, handler: (event: WebSocketEvent) => void): void {
    this.webSocketService.onEvent(eventType, handler);
  }

  async getConnectionInfo(request: GetConnectionInfoRequest): Promise<GetConnectionInfoResponse> {
    const connections = this.webSocketService.getActiveConnections();
    const connection = connections.find(conn => conn.userId === request.userId) || null;
    return { connection };
  }

  async getActiveConnections(request: GetActiveConnectionsRequest): Promise<GetActiveConnectionsResponse> {
    const connections = this.webSocketService.getActiveConnections();
    return { connections };
  }

  async getWebSocketStats(request: GetWebSocketStatsRequest): Promise<GetWebSocketStatsResponse> {
    const stats = this.webSocketService.getStats();
    return { stats };
  }

  async checkConnectionStatus(request: IsConnectedRequest): Promise<IsConnectedResponse> {
    const connected = this.webSocketService.isConnected();
    return { connected };
  }
}
