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
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AssistantService } from "@modules/assistant/assistant.service";
import { PersonaProfileService } from '../persona-profile/persona-profile.service';

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
      private readonly assistantService: AssistantService,
      private readonly personaProfileService: PersonaProfileService
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
    const { userId, assistantId, channelId, message } = data;
    this.log(`[API][WebSocket] handleMessage called`, { userId, assistantId, channelId, message });

    try {
      const response = await this.chatService.processUserMessage(userId, assistantId, channelId, message);
      this.log(`[API][WebSocket] processUserMessage response`, response);

      this.server.emit('receive_message', response);
      this.log(`[API][WebSocket] Sent feedback to all clients:`, response);
    } catch (error) {
      this.log(`[API][WebSocket] Error processing message from client ${client.id}:`, error);
      client.emit('error', { message: error?.message ?? 'Unknown error' });
    }
  }

  private log(...args: any[]) {
    console.log(...args);
  }
}
