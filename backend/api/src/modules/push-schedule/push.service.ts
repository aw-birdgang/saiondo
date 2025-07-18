import {Injectable} from '@nestjs/common';
import {FirebaseService} from '../../common/firebase/firebase.service';
import {PrismaService} from '../../common/prisma/prisma.service';
import {MessageSender} from '@prisma/client';
import {ChatService} from "@modules/chat/chat.service";
import * as admin from 'firebase-admin';
import {createWinstonLogger} from "@common/logger/winston.logger";

@Injectable()
export class PushService {
  private readonly logger = createWinstonLogger(PushService.name);

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
    await this.chatService.createChat({
      userId,
      assistantId,
      channelId,
      sender: MessageSender.AI,
      message,
    });
  }

  /**
   * FCM 환경이 정상적으로 초기화되어 있는지 체크
   */
  public async validateFcmEnvironment(): Promise<{ ok: boolean; reason?: string }> {
    try {
      // 1. Firebase App이 초기화되어 있는지
      if (!admin.apps.length) {
        return { ok: false, reason: 'Firebase app is not initialized.' };
      }

      // 2. 기본 앱 인스턴스 사용 (올바른 방법)
      const app = admin.app();
      if (!app) {
        return { ok: false, reason: 'Firebase app instance is null.' };
      }

      // 3. credential이 존재하는지 확인
      if (!app.options.credential) {
        return { ok: false, reason: 'Firebase credential is not configured.' };
      }

      // 4. 인증 객체가 유효한지 (access token 발급 시도)
      await app.options.credential.getAccessToken();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, reason: err.message || String(err) };
    }
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
