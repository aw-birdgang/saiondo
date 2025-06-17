import { Gender } from '@prisma/client';

export class User {
  public id?: string;
  public name: string;
  public email: string;
  public password: string;
  public birthDate: Date;
  public gender: Gender;
  public fcmToken?: string | null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;
  public point?: number;
  public walletId?: string | null;
  public wallet?: any;

  // 구독 관련 필드
  public isSubscribed?: boolean;
  public subscriptionUntil?: Date | null;

  // 관계
  public assistants?: any[];
  public chats?: any[];
  public personaProfiles?: any[];
  public pushSchedules?: any[];
  public generatedReports?: any[];
  public events?: any[];
  public suggestedFields?: any[];
  public pointHistories?: any[];
  public tokenTransfers?: any[];
  public channelMembers?: any[];
  public invitationsSent?: any[];
  public invitationsReceived?: any[];
}
