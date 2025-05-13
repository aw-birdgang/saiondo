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
  roomId: string;
  message: string;
}

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

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

    if (this.connectedClients.has(client.id)) {
      return;
    }
    this.connectedClients.add(client.id);

    this.log(`[API][WebSocket] Client connected: ${client.id}, transport: ${transport}, address: ${address}, total clients: ${count}, time: ${now}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.log(`[API][WebSocket] Client disconnected: ${client.id}, time: ${new Date().toISOString()}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessagePayload
  ) {
    this.log(`[API][WebSocket] Received from client ${client.id}:`, data);

    try {
      // LLM 피드백 및 DB 저장
      const { userChat, aiChat } = await this.chatService.sendToLLM(
        data.message,
        data.roomId,
        data.userId,
      );

      // 클라이언트에 보낼 응답 구조
      const response = {
        ...data,
        userChat,
        aiChat,
      };

      this.server.emit('receive_message', response);
      this.log(`[API][WebSocket] Sent feedback to all clients:`, response);
    } catch (error) {
      this.log(`[API][WebSocket] Error processing message from client ${client.id}:`, error);
      client.emit('error', { message: '메시지 처리 중 오류가 발생했습니다.', detail: error?.message });
    }
  }

  private log(...args: any[]) {
    // 추후 winston 등으로 교체 가능
    console.log(...args);
  }
}
