import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {PushService} from '../push-schedule/push.service';
import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationService {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pushService: PushService,
  ) {}

  async sendNotification(userId: string, notification: {
    title: string;
    body: string;
    type: 'ANALYSIS_COMPLETE' | 'NEW_MESSAGE' | 'RELATIONSHIP_TIP' | 'MISSION_REMINDER' | 'REPORT';
    data?: any;
  }) {
    try {
      // 1. 데이터베이스에 알림 저장
      await this.prisma.notification.create({
        data: {
          userId,
          title: notification.title,
          body: notification.body,
          type: notification.type,
          data: notification.data ? JSON.stringify(notification.data) : null,
          isRead: false,
        },
      });

      // 2. 실시간 웹소켓 알림
      this.server.to(userId).emit('notification', notification);

      // 3. FCM 푸시 알림
      await this.pushService.sendPushToUser(userId, notification.title, notification.body);

      this.logger.log(`알림 전송 완료: ${userId} - ${notification.type}`);
    } catch (error) {
      this.logger.error(`알림 전송 실패: ${error.message}`);
    }
  }

  async sendCoupleNotification(channelId: string, notification: {
    title: string;
    body: string;
    type: 'ANALYSIS_COMPLETE' | 'NEW_MESSAGE' | 'RELATIONSHIP_TIP' | 'MISSION_REMINDER' | 'REPORT';
    data?: any;
  }) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
        include: { members: { include: { user: true } } },
      });

      if (!channel) return;

      // 커플 멤버들에게 알림 전송
      for (const member of channel.members) {
        await this.sendNotification(member.userId, notification);
      }
    } catch (error) {
      this.logger.error(`커플 알림 전송 실패: ${error.message}`);
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async getUnreadNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
  }
}
