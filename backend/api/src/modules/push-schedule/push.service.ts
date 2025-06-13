import {Injectable, Logger} from '@nestjs/common';
import {FirebaseService} from '../../common/firebase/firebase.service';
import {PrismaService} from '../../common/prisma/prisma.service';
import {MessageSender} from '@prisma/client';
import {ChatService} from "@modules/chat/chat.service";

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}

  // FCM 메시지 전송
  private async sendFcmMessage(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const message = {
        token,
        notification: { title, body },
        data,
      };
      const response = await this.firebaseService.messaging.send(message);
      this.logger.log(`Push sent: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Push send error', error);
      throw error;
    }
  }

  // 유저의 FCM 토큰 조회
  private async getUserFcmToken(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.fcmToken) {
      throw new Error('FCM 토큰이 없습니다.');
    }
    return user.fcmToken;
  }

  // 유저의 최신 assistant 조회
  private async getLatestAssistant(userId: string) {
    return this.prisma.assistant.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 채팅 히스토리 저장
  private async saveChatHistory(
    userId: string,
    assistantId: string,
    channelId: string,
    message: string,
  ) {
    await this.chatService.create({
      userId,
      assistantId,
      channelId,
      sender: MessageSender.AI,
      message,
    });
  }

  // 외부에서 호출하는 메인 함수
  async sendPushToUser(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const fcmToken = await this.getUserFcmToken(userId);
    const pushResult = await this.sendFcmMessage(fcmToken, title, body, data);
    this.logger.log(`sendPushToUser: ${pushResult}`);

    const assistant = await this.getLatestAssistant(userId);
    if (assistant) {
      await this.saveChatHistory(userId, assistant.id, assistant.channelId, body);
    }

    return pushResult;
  }

  // public sendPush 추가
  async sendPush(token: string, title: string, body: string, data?: Record<string, string>) {
    return this.sendFcmMessage(token, title, body, data);
  }
}
