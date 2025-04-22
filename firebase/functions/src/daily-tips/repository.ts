import * as admin from 'firebase-admin';
import { DailyTip, UpdateDailyTipsData } from './types';

export class DailyTipsRepository {
    private static instance: DailyTipsRepository;
    private readonly db: FirebaseFirestore.Firestore;

    private constructor() {
        this.db = admin.firestore();
    }

    public static getInstance(): DailyTipsRepository {
        if (!DailyTipsRepository.instance) {
            DailyTipsRepository.instance = new DailyTipsRepository();
        }
        return DailyTipsRepository.instance;
    }

    async createTip(tip: Omit<DailyTip, 'id'>) {
        return this.db.collection('daily_tips').add(tip);
    }

    async getUserById(userId: string) {
        const doc = await this.db.collection('users').doc(userId).get();
        return doc.data();
    }
}
