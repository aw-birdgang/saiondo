// firebase/functions/src/services/notification.ts

import * as admin from 'firebase-admin';
import { EmotionAnalysis } from '../daily-tips/types';

export class NotificationService {
    private static instance: NotificationService;
    private readonly db: FirebaseFirestore.Firestore;

    private constructor() {
        this.db = admin.firestore();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async notifyPartner(
        coupleId: string,
        partnerId: string,
        emotion: EmotionAnalysis
    ) {
        const notification = {
            userId: partnerId,
            type: 'new_emotion_shared',
            title: '파트너가 감정을 공유했습니다',
            body: `파트너가 "${emotion.emotion}" 감정을 느끼고 있습니다. 함께 이야기를 나눠보세요.`,
            isRead: false,
            createdAt: admin.firestore.Timestamp.now()
        };

        await this.db.collection('notifications').add(notification);
    }
}
