export interface EmotionAnalysis {
  gender: 'male' | 'female';
  emotion: string;
  intensity: number;
  situation: string;
  partnerBehavior: string;
}

export interface DailyTip {
  id: string;
  coupleId: string;
  fromGender: 'male' | 'female';
  toGender: 'male' | 'female';
  userEmotion: EmotionAnalysis;
  aiAdvice: {
    content: string;
    suggestedActions: string[];
    explanation: string;
  };
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  category: string;
  isPrivate: boolean;
}

export interface UpdateDailyTipsData {
  emotion: string;
  situation: string;
  partnerBehavior: string;
  intensity: number;
  category: string;
  isPrivate?: boolean;
}

export interface UserData {
  id: string;
  coupleId?: string;
  gender?: 'male' | 'female';
  partnerId?: string;
  name?: string;
  mbti?: string;
  email: string;
}

export type RequiredInputField = 'emotion' | 'situation' | 'intensity';
