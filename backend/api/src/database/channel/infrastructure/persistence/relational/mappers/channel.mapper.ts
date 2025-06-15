import { ChannelEntity } from '../entities/channel.entity';
import { Channel as PrismaChannel } from '@prisma/client';
import { Channel } from "../../../../domain/channel";

export class ChannelMapper {
  // Prisma → Entity
  static fromPrisma(prisma: PrismaChannel): ChannelEntity {
    return {
      id: prisma.id,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
      inviteCode: prisma.inviteCode,
      status: prisma.status,
      startedAt: prisma.startedAt,
      endedAt: prisma.endedAt,
      anniversary: prisma.anniversary,
      keywords: prisma.keywords,
      deletedAt: prisma.deletedAt,
    };
  }

  // Entity → 도메인
  static toDomain(entity: ChannelEntity): Channel {
    const channel = new Channel();
    channel.id = entity.id;
    channel.createdAt = entity.createdAt;
    channel.updatedAt = entity.updatedAt;
    channel.inviteCode = entity.inviteCode;
    channel.status = entity.status;
    channel.startedAt = entity.startedAt;
    channel.endedAt = entity.endedAt;
    channel.anniversary = entity.anniversary;
    channel.keywords = entity.keywords;
    channel.deletedAt = entity.deletedAt;
    return channel;
  }

  // 도메인 → Entity
  static toEntity(domain: Channel): ChannelEntity {
    return {
      id: domain.id,
      createdAt: domain.createdAt!,
      updatedAt: domain.updatedAt!,
      inviteCode: domain.inviteCode,
      status: domain.status!,
      startedAt: domain.startedAt ?? null,
      endedAt: domain.endedAt ?? null,
      anniversary: domain.anniversary ?? null,
      keywords: domain.keywords ?? null,
      deletedAt: domain.deletedAt ?? null,
    };
  }
}
