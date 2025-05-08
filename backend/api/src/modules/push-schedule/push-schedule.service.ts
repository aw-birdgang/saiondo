// src/modules/push-schedule/push-schedule.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class PushScheduleService {
    constructor(private readonly prisma: PrismaService) {}

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
}
