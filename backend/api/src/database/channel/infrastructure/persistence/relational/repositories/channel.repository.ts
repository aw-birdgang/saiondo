import {Injectable} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {ChannelRepository} from '../../channel.repository';
import {Channel} from "../../../../domain/channel";
import {ChannelMapper} from '../mappers/channel.mapper';

@Injectable()
export class RelationalChannelRepository extends ChannelRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Channel | null> {
    const prismaChannel = await this.prisma.channel.findUnique({where: {id}});
    if (!prismaChannel) return null;
    const entity = ChannelMapper.fromPrisma(prismaChannel);
    return ChannelMapper.toDomain(entity);
  }

  async findAll(): Promise<Channel[]> {
    const prismaChannels = await this.prisma.channel.findMany();
    return prismaChannels.map(pc => ChannelMapper.toDomain(ChannelMapper.fromPrisma(pc)));
  }

  async save(channel: Channel): Promise<Channel> {
    const entity = ChannelMapper.toEntity(channel);
    const prismaChannel = await this.prisma.channel.upsert({
      where: {id: entity.id},
      update: {
        inviteCode: entity.inviteCode,
        status: entity.status,
        startedAt: entity.startedAt ?? undefined,
        endedAt: entity.endedAt ?? undefined,
        anniversary: entity.anniversary ?? undefined,
        keywords: entity.keywords ?? undefined,
        deletedAt: entity.deletedAt ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        id: entity.id,
        inviteCode: entity.inviteCode,
        status: entity.status,
        startedAt: entity.startedAt ?? undefined,
        endedAt: entity.endedAt ?? undefined,
        anniversary: entity.anniversary ?? undefined,
        keywords: entity.keywords ?? undefined,
        deletedAt: entity.deletedAt ?? undefined,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });
    return ChannelMapper.toDomain(ChannelMapper.fromPrisma(prismaChannel));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.channel.delete({where: {id}});
  }

  // ===== 복합 쿼리/조인 메서드들 =====

  async findAllWithAssistants(): Promise<any[]> {
    return this.prisma.channel.findMany({include: {assistants: true}});
  }

  async findByIdWithMembers(channelId: string): Promise<any> {
    return this.prisma.channel.findUnique({
      where: {id: channelId},
      include: {members: {include: {user: true}}}});
  }

  async findByInviteCodeWithMembers(inviteCode: string): Promise<any> {
    return this.prisma.channel.findUnique({
      where: {inviteCode},
      include: {members: {include: {user: true}}}});
  }

  async findFirstCurrentChannel(userId: string): Promise<any> {
    return this.prisma.channel.findFirst({
      where: {
        members: {some: {userId}},
        status: {in: ['PENDING', 'ACTIVE']},
      },
      include: {members: {include: {user: true}}}});
  }

  async findAvailableChannels(): Promise<any[]> {
    return this.prisma.channel.findMany({
      where: { status: { in: ['PENDING', 'ACTIVE'] } }
    });
  }

  async findMyChannels(userId: string): Promise<any[]> {
    return this.prisma.channel.findMany({
      where: {members: {some: {userId}}},
      include: {members: {include: {user: true}}}});
  }

  async findByUserId(userId: string): Promise<any[]> {
    return this.prisma.channel.findMany({
      where: {members: {some: {userId}}},
    });
  }

  async updateInviteCode(channelId: string, inviteCode: string): Promise<any> {
    return this.prisma.channel.update({
      where: {id: channelId},
      data: {inviteCode},
    });
  }

  async addMember(channelId: string, userId: string, role: string): Promise<any> {
    return this.prisma.channelMember.create({
      data: {channelId, userId, role},
    });
  }

  async updateStatus(channelId: string, status: string): Promise<any> {
    return this.prisma.channel.update({
      where: {id: channelId},
      data: {status},
    });
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.channelMember.findFirst({
      where: {channelId, userId},
    });
    return !!member;
  }

  async cleanupEmptyChannels(): Promise<any> {
    return this.prisma.channel.deleteMany({
      where: {status: 'ENDED'},
    });
  }

  async removeMember(channelId: string, userId: string): Promise<any> {
    return this.prisma.channelMember.deleteMany({
      where: {channelId, userId},
    });
  }

  async createInvitation(channelId: string, inviterId: string, inviteeId: string): Promise<any> {
    return this.prisma.invitation.create({
      data: {channelId, inviterId, inviteeId, status: 'PENDING'},
    });
  }

}
