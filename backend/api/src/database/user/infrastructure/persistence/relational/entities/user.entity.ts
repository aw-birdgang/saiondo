import { Gender } from '@prisma/client';

export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  birthDate: Date;
  gender: Gender;
  fcmToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  point?: number;
  walletId?: string | null;
  wallet?: any;

  // 관계
  assistants?: any[];
  chats?: any[];
  personaProfiles?: any[];
  pushSchedules?: any[];
  generatedReports?: any[];
  events?: any[];
  suggestedFields?: any[];
  pointHistories?: any[];
  tokenTransfers?: any[];
  channelMembers?: any[];
  invitationsSent?: any[];
  invitationsReceived?: any[];

  // 구독 관련 필드
  isSubscribed?: boolean;
  subscriptionUntil?: Date | null;
}
