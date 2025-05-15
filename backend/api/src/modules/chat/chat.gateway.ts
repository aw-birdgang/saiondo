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
import {RoomService} from '../room/room.service';
import {PersonaProfileService} from '../persona-profile/persona-profile.service';
import { PersonaProfile } from '@prisma/client';

interface SendMessagePayload {
  userId: string;
  roomId: string;
  message: string;
}

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
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
    const { userId, roomId, message } = data;

    // 1. 룸 참여자 조회
    const participants = await this.roomService.getRoomParticipants(roomId);
    if (!participants || participants.length !== 2) {
      this.log(`[API][WebSocket] Room participants not found or not a couple: roomId=${roomId}`);
      client.emit('error', { message: '채팅방 참여자 정보를 찾을 수 없습니다.' });
      return;
    }
    const questioner = participants.find(u => u.id === userId);
    const partner = participants.find(u => u.id !== userId);

    if (!questioner || !partner) {
      this.log(`[API][WebSocket] Questioner or partner not found: userId=${userId}, roomId=${roomId}`);
      client.emit('error', { message: '질문자 또는 상대방 정보를 찾을 수 없습니다.' });
      return;
    }

    // 2. 상대방 특징 조회
    const partnerPersona: PersonaProfile[] = await this.personaProfileService.getPersonaByUserId(partner.id);
    console.log('partnerPersona:', JSON.stringify(partnerPersona, null, 2));

    let personaSummary = partnerPersona.length > 0
        ? partnerPersona.map(p => `${p.categoryCodeId}: ${p.content}`).join(', ')
        : '정보없음';

    // 3. LLM 프롬프트에 상대방 정보 포함
    const prompt = `
질문자: ${questioner.gender}
상대방: ${partner.gender}
상대방 특징: ${personaSummary}
질문: ${message}
`;

    this.log(`[API][WebSocket] Received from client ${client.id}:`, data);
    this.log(`[API][WebSocket] LLM Prompt:`, prompt);

    try {
      // LLM 피드백 및 DB 저장
      const { userChat, aiChat } = await this.chatService.sendToLLM(
        message,
        roomId,
        userId,
        prompt,
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
