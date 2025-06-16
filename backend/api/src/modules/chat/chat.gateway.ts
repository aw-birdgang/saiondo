import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {ChatService} from './chat.service';

interface SendMessagePayload {
  userId: string;
  assistantId: string;
  channelId: string;
  message: string;
}

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  private connectedClients = new Set<string>();

  afterInit(server: Server) {
    this.server = server;
    this.log('[API][WebSocket] Server initialized');
  }

  handleConnection(client: Socket) {
    const transport = client.conn.transport.name;
    const address = client.handshake.address;
    const now = new Date().toISOString();

    let count = 'unknown';
    if (this.server && this.server.engine) {
      count = this.server.engine.clientsCount.toString();
    }

    if (this.connectedClients.has(client.id)) return;
    this.connectedClients.add(client.id);

    this.log(
      `[API][WebSocket] Client connected: ${client.id}, transport: ${transport}, address: ${address}, total clients: ${count}, time: ${now}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.log(
      `[API][WebSocket] Client disconnected: ${client.id}, time: ${new Date().toISOString()}`,
    );
  }

  @SubscribeMessage('send_message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: SendMessagePayload) {
    const { userId, assistantId, channelId, message } = data;
    this.log(`[API][WebSocket] handleMessage called`, {
      userId,
      assistantId,
      channelId,
      message,
    });

    try {
      const response = await this.chatService.processQARelationshipCoachMessage(
        userId,
        assistantId,
        channelId,
        message,
      );
      this.log(`[API][WebSocket] processUserMessage response`, response);
      this.server.emit('receive_message', response);
      this.log(`[API][WebSocket] Sent feedback to all clients:`, response.aiChat);
    } catch (error) {
      this.log(`[API][WebSocket] Error processing message from client ${client.id}:`, error);

      // NestJS HttpException 또는 일반 에러 모두 처리
      let errorPayload: any = {
        message: error?.message ?? 'Unknown error',
      };
      if (error?.response) {
        // NestJS HttpException의 경우
        errorPayload = {
          ...error.response,
          status: error.status ?? error.response?.statusCode ?? 500,
        };
      }
      client.emit('error', errorPayload);
    }
  }

  private log(...args: any[]) {
    console.log(...args);
  }
}
