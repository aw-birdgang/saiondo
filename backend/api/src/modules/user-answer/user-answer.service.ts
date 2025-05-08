// src/modules/user-answer/user-answer.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class UserAnswerService {
    constructor(private readonly prisma: PrismaService) {}

    async submitAnswer(pushScheduleId: string, answerText: string) {
        return this.prisma.userAnswer.create({
            data: {
                pushScheduleId,
                answerText,
            },
        });
    }
}
