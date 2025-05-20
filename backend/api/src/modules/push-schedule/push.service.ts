import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../common/firebase/firebase.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PushService {
    private readonly logger = new Logger(PushService.name);

    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly prisma: PrismaService,
    ) {}

    async sendPush(token: string, title: string, body: string, data?: Record<string, string>) {
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

    async sendPushToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user?.fcmToken) {
            return this.sendPush(user.fcmToken, title, body, data);
        }
        throw new Error('FCM 토큰이 없습니다.');
    }
}
