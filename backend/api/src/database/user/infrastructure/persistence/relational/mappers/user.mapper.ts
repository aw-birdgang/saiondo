import {User} from '../../../../domain/user';
import {UserEntity} from '../entities/user.entity';
import {User as PrismaUser, Assistant, Wallet, Chat, PersonaProfile, PushSchedule, Advice, Event, SuggestedField, PointHistory, TokenTransfer, ChannelMember, Invitation} from "@prisma/client";

type PrismaUserWithRelations = PrismaUser & {
  assistants?: Assistant[];
  wallet?: Wallet | null;
  chats?: Chat[];
  personaProfiles?: PersonaProfile[];
  pushSchedules?: PushSchedule[];
  generatedReports?: Advice[];
  events?: Event[];
  suggestedFields?: SuggestedField[];
  pointHistories?: PointHistory[];
  tokenTransfers?: TokenTransfer[];
  channelMembers?: ChannelMember[];
  invitationsSent?: Invitation[];
  invitationsReceived?: Invitation[];
  // ...다른 관계 필드
};

export class UserMapper {

  static fromPrisma(prisma: PrismaUserWithRelations): User {
    const user = new User();
    user.id = prisma.id;
    user.name = prisma.name;
    user.email = prisma.email;
    user.password = prisma.password;
    user.birthDate = prisma.birthDate;
    user.gender = prisma.gender;
    user.fcmToken = prisma.fcmToken;
    user.createdAt = prisma.createdAt;
    user.updatedAt = prisma.updatedAt;
    user.deletedAt = prisma.deletedAt ?? null;
    user.point = prisma.point;
    user.walletId = prisma.walletId ?? undefined;
    user.wallet = prisma.wallet ?? undefined;

    // 관계 필드 매핑
    user.assistants = prisma.assistants ?? undefined;
    user.chats = prisma.chats ?? undefined;
    user.personaProfiles = prisma.personaProfiles ?? undefined;
    user.pushSchedules = prisma.pushSchedules ?? undefined;
    user.generatedReports = prisma.generatedReports ?? undefined;
    user.events = prisma.events ?? undefined;
    user.suggestedFields = prisma.suggestedFields ?? undefined;
    user.pointHistories = prisma.pointHistories ?? undefined;
    user.tokenTransfers = prisma.tokenTransfers ?? undefined;
    user.channelMembers = prisma.channelMembers ?? undefined;
    user.invitationsSent = prisma.invitationsSent ?? undefined;
    user.invitationsReceived = prisma.invitationsReceived ?? undefined;
    // ...다른 관계 필드도 필요시 추가

    return user;
  }

  /**
   * 영속성 엔티티(UserEntity)를 도메인 엔티티(User)로 변환
   */
  static toDomain(entity: UserEntity): User {
    const user = new User();
    user.id = entity.id;
    user.name = entity.name;
    user.email = entity.email;
    user.password = entity.password;
    user.birthDate = entity.birthDate;
    user.gender = entity.gender;
    user.fcmToken = entity.fcmToken;
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;
    user.deletedAt = entity.deletedAt ?? null;
    user.point = entity.point;
    user.walletId = entity.walletId;
    user.wallet = entity.wallet;
    user.assistants = entity.assistants;
    user.chats = entity.chats;
    user.personaProfiles = entity.personaProfiles;
    user.pushSchedules = entity.pushSchedules;
    user.generatedReports = entity.generatedReports;
    user.events = entity.events;
    user.suggestedFields = entity.suggestedFields;
    user.pointHistories = entity.pointHistories;
    user.tokenTransfers = entity.tokenTransfers;
    user.channelMembers = entity.channelMembers;
    user.invitationsSent = entity.invitationsSent;
    user.invitationsReceived = entity.invitationsReceived;
    return user;
  }

  /**
   * 도메인 엔티티(User)를 영속성 엔티티(UserEntity)로 변환
   */
  static toEntity(domain: User): UserEntity {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      password: domain.password,
      birthDate: domain.birthDate,
      gender: domain.gender,
      fcmToken: domain.fcmToken,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt ?? null,
      point: domain.point,
      walletId: domain.walletId,
      wallet: domain.wallet,
      assistants: domain.assistants,
      chats: domain.chats,
      personaProfiles: domain.personaProfiles,
      pushSchedules: domain.pushSchedules,
      generatedReports: domain.generatedReports,
      events: domain.events,
      suggestedFields: domain.suggestedFields,
      pointHistories: domain.pointHistories,
      tokenTransfers: domain.tokenTransfers,
      channelMembers: domain.channelMembers,
      invitationsSent: domain.invitationsSent,
      invitationsReceived: domain.invitationsReceived,
    } as UserEntity;
  }
}
