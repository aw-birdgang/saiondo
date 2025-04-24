import * as admin from 'firebase-admin';
import { BaseRepository } from '../core/repository/base.repository';
import { Emotion, CreateEmotionData } from './types';
import {AppError} from "../core/error/app-error";

export class EmotionRepository extends BaseRepository<Emotion> {
    private static instance: EmotionRepository;

    private constructor() {
        super('emotions');
    }

    static getInstance(): EmotionRepository {
        if (!EmotionRepository.instance) {
            EmotionRepository.instance = new EmotionRepository();
        }
        return EmotionRepository.instance;
    }

    async findById(id: string): Promise<Emotion | null> {
        try {
            const doc = await this.db.collection(this.collection).doc(id).get();
            if (!doc.exists) return null;
            return { id: doc.id, ...doc.data() } as Emotion;
        } catch (error) {
            throw new AppError({
                code: 'internal',
                message: '감정 데이터 조회 중 오류가 발생 했습니다.',
                details: error
            });
        }
    }

    async createEmotion(data: CreateEmotionData & { userId: string }): Promise<Emotion> {
        try {
            const emotionData: Omit<Emotion, 'id'> = {
                ...data,
                category: data.category || 'general',
                tags: data.tags || [],
                date: admin.firestore.Timestamp.fromDate(data.date),
                createdAt: this.getTimestamp(),
                updatedAt: this.getTimestamp(),
            };

            const docRef = await this.db.collection(this.collection).add(emotionData);
            return {
                id: docRef.id,
                ...emotionData
            };
        } catch (error) {
            throw new AppError({
                code: 'internal',
                message: '감정 데이터 생성 중 오류가 발생 했습니다.',
                details: error
            });
        }
    }

    private getTimestamp(): admin.firestore.Timestamp {
        return admin.firestore.Timestamp.now();
    }
}
