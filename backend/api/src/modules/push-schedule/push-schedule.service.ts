import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { PushService } from './push.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PushScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pushService: PushService,
  ) {}

  async scheduleQuestion(userId: string, questionId: string, scheduledAt: Date) {
    return this.prisma.pushSchedule.create({
      data: {
        userId,
        questionId,
        scheduledAt,
        status: 'SCHEDULED',
      },
    });
  }

  async markAsSent(id: string) {
    return this.prisma.pushSchedule.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date() },
    });
  }

  async sendScheduledPushes() {
    const now = new Date();
    const schedules = await this.prisma.pushSchedule.findMany({
      where: { status: 'SCHEDULED', scheduledAt: { lte: now } },
    });

    for (const schedule of schedules) {
      // 유저의 FCM 토큰을 가져오는 로직 필요 (예: user 테이블에 저장)
      const user = await this.prisma.user.findUnique({
        where: { id: schedule.userId },
      });
      if (user?.fcmToken) {
        await this.pushService.sendPush(user.fcmToken, '질문 알림', '새로운 질문이 도착했습니다!', {
          questionId: schedule.questionId,
        });
        await this.markAsSent(schedule.id);
      }
    }
  }

  // @Cron('*/1 * * * *')
  async handleCron() {
    await this.sendScheduledPushes();
  }
}
