import * as admin from 'firebase-admin';
import {BaseRepository} from "../core/repository/base.repository";
import {DailyTip, UserData} from "./types";
import {AppError} from "../core/error/app-error";

export class DailyTipsRepository extends BaseRepository<DailyTip> {
    private static instance: DailyTipsRepository;
    private readonly userCollection = 'users';

    private constructor() {
        super('dailyTips');
    }

    static getInstance(): DailyTipsRepository {
        if (!DailyTipsRepository.instance) {
            DailyTipsRepository.instance = new DailyTipsRepository();
        }
        return DailyTipsRepository.instance;
    }

    async getUserData(userId: string): Promise<UserData | null> {
        try {
            const doc = await this.db.collection(this.userCollection).doc(userId).get();
            if (!doc.exists) return null;

            const data = doc.data() as any;
            return {
                id: doc.id,
                gender: data.gender,
                coupleId: data.coupleId,
                partnerId: data.partnerId,
            };
        } catch (error) {
            throw new AppError({
                code: 'internal',
                message: '사용자 정보 조회 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    async createTip(data: Omit<DailyTip, 'id'>): Promise<DailyTip> {
        try {
            const docRef = await this.db.collection(this.collection).add({
                ...data,
                createdAt: this.getTimestamp(),
                updatedAt: this.getTimestamp(),
            });

            return {
                id: docRef.id,
                ...data
            };
        } catch (error) {
            throw new AppError({
                code: 'internal',
                message: '일일 팁 생성 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    private getTimestamp(): admin.firestore.Timestamp {
        return admin.firestore.Timestamp.now();
    }
}
