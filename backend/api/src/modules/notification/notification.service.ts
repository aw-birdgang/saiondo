import { Injectable } from '@nestjs/common';
import { PushService } from '../push-schedule/push.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationRepository } from '../../database/notification/infrastructure/persistence/notification.repository';
import { CreateNotificationDto } from '../../database/notification/dto/create-notification.dto';
import { QueryNotificationDto } from '../../database/notification/dto/query-notification.dto';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationService {
  @WebSocketServer()
  server: Server;

  private readonly logger = createWinstonLogger(NotificationService.name);

  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly pushService: PushService,
  ) {}

  // 1. 알림 생성 및 전송 (DB, FCM, WebSocket)
  async sendNotification(userId: string, notification: CreateNotificationDto) {
    try {
      // 0. FCM 환경 validation 체크
      const fcmCheck = await this.pushService.validateFcmEnvironment();

      if (!fcmCheck.ok) {
        this.logger.error(`[FCM Validation] FCM 환경 이상: ${fcmCheck.reason}`);
        // DB에는 저장, FCM/웹소켓은 스킵 또는 fallback 처리
        await this.notificationRepo.create({
          userId,
          title: notification.title,
          body: notification.body,
          type: notification.type,
          data: notification.data ? JSON.stringify(notification.data) : null,
          isRead: false,
        });
        throw new Error(`FCM 환경 이상: ${fcmCheck.reason}`);
      }

      // 1. DB 저장
      const saved = await this.notificationRepo.create({
        userId,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        data: notification.data ? JSON.stringify(notification.data) : null,
        isRead: false,
      });

      // 2. 실시간 웹소켓 알림
      this.server.to(userId).emit('notification', notification);

      // 3. FCM 푸시 알림
      await this.pushService.sendPushToUser(userId, notification.title, notification.body);

      this.logger.log(`알림 전송 완료: ${userId} - ${notification.type}`);

      return saved;
    } catch (error) {
      this.logger.error(`알림 전송 실패: ${error.message}`);
      throw error;
    }
  }

  // 2. 유저별 알림 목록 조회 (페이징/필터)
  async getNotificationsByUserId(userId: string, query: QueryNotificationDto) {
    return this.notificationRepo.findByUserId(userId, query);
  }

  // 3. 유저별 읽지 않은 알림 목록
  async getUnreadNotifications(userId: string) {
    return this.notificationRepo.findUnreadByUserId(userId);
  }

  // 4. 유저별 읽지 않은 알림 개수
  async countUnreadNotifications(userId: string) {
    return this.notificationRepo.countUnreadByUserId(userId);
  }

  // 5. 개별 알림 읽음 처리
  async markAsRead(id: string) {
    return this.notificationRepo.markAsRead(id);
  }

  // 6. 유저의 모든 알림 읽음 처리
  async markAllAsRead(userId: string) {
    return this.notificationRepo.markAllAsRead(userId);
  }

  // 7. 알림 삭제
  async removeNotification(id: string) {
    return this.notificationRepo.remove(id);
  }

  async sendCoupleNotification(
    channelId: string,
    notification: {
      title: string;
      body: string;
      type:
        | 'ANALYSIS_COMPLETE'
        | 'NEW_MESSAGE'
        | 'RELATIONSHIP_TIP'
        | 'MISSION_REMINDER'
        | 'REPORT';
      data?: any;
    },
  ) {
    try {
      const channel = await this.notificationRepo['prisma'].channel.findUnique({
        where: { id: channelId },
        include: { members: { include: { user: true } } },
      });

      if (!channel) return;

      // 커플 멤버들에게 알림 전송
      for (const member of channel.members) {
        await this.sendNotification(member.userId, {
          ...notification,
          userId: member.userId,
        });
      }
    } catch (error) {
      this.logger.error(`커플 알림 전송 실패: ${error.message}`);
    }
  }
}
