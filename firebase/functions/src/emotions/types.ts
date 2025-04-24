import * as admin from 'firebase-admin';
import {BaseEntity} from "../core/type/common";

export interface CreateEmotionData {
    emotion: string;
    intensity: number;
    situation: string;
    date: Date;
    category?: string;
    tags?: string[];
    note?: string;
}

export interface Emotion extends BaseEntity {
    userId: string;
    emotion: string;
    intensity: number;
    situation: string;
    date: admin.firestore.Timestamp;
    category: string;
    tags: string[];
    note?: string;
    createdAt: admin.firestore.Timestamp;
    updatedAt: admin.firestore.Timestamp;
}
