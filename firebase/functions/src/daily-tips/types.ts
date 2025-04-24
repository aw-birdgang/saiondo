import {BaseEntity} from "../core/type/common";

export interface EmotionAnalysis {
    gender: 'male' | 'female';
    emotion: string;
    intensity: number;
    situation: string;
    partnerBehavior?: string;
}

export interface AiAdvice {
    content: string;
    suggestedActions: string[];
    explanation: string;
}

export interface DailyTip extends BaseEntity {
    coupleId: string;
    fromGender: 'male' | 'female';
    toGender: 'male' | 'female';
    userEmotion: EmotionAnalysis;
    aiAdvice: AiAdvice;
    category: string;
    isPrivate: boolean;
}

export interface UpdateDailyTipsData {
    emotion: string;
    intensity: number;
    situation: string;
    partnerBehavior?: string;
    category?: string;
    isPrivate?: boolean;
}

export interface UserData {
    id: string;
    gender: 'male' | 'female';
    coupleId?: string;
    partnerId?: string;
}
