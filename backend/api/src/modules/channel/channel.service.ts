import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {InviteChannelDto} from '@modules/channel/dto/invite-channel.dto';
import {generateInviteCode} from "@common/utils/invite-code.util";

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(ChannelService.name);

  // 커플(채널) 생성 + 하위 Assistant 생성
  async createChannel(user1Id: string, user2Id: string) {
    const inviteCode = generateInviteCode();
    return this.prisma.channel.create({
      data: {
        user1Id,
        user2Id,
        status: 'ACTIVE',
        startedAt: new Date(),
        inviteCode,
        assistants: {
          create: [{ userId: user1Id }, { userId: user2Id }],
        },
      },
      include: { assistants: true },
    });
  }

  // 채널 전체 조회
  async findAll() {
    return this.prisma.channel.findMany({ include: { assistants: true } });
  }

  // 채널 단건 조회
  async getChannelById(channelId: string) {
    return this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { assistants: true },
    });
  }

  async getJustChannelInfoById(channelId: string) {
    return this.prisma.channel.findUnique({
      where: { id: channelId },
    });
  }

  // 채널 삭제
  async remove(id: string) {
    return this.prisma.channel.delete({ where: { id } });
  }

  async getChannelParticipants(channelId: string, userId: string): Promise<string | null> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    if (!channel) return null;

    if (channel.user1Id === userId) {
      return channel.user2Id;
    } else if (channel.user2Id === userId) {
      return channel.user1Id;
    } else {
      return null;
    }
  }

  // 초대(커플 생성, 상태는 PENDING)
  async invite(dto: InviteChannelDto) {
    const user1Id = dto.user1Id;
    const user2Id = dto.user2Id;
    return this.prisma.channel.create({
      data: {
        user1Id,
        user2Id,
        status: 'PENDING',
        startedAt: new Date(),
      },
    });
  }

  // 수락(상태를 ACTIVE로 변경)
  async accept(channelId: string) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { status: 'ACTIVE' },
    });
  }

  // 거절/종료(상태를 ENDED로 변경)
  async reject(channelId: string) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { status: 'ENDED' },
    });
  }

  // 상태 변경(일반화)
  async updateStatus(channelId: string, status: string) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { status },
    });
  }

  async joinByInviteCode(inviteCode: string, userId: string) {
    // 초대코드로 채널 찾기
    const channel = await this.prisma.channel.findUnique({ where: { inviteCode } });
    if (!channel) throw new Error('Invalid invite code');
    if (channel.user2Id) throw new Error('Already matched');

    // user2Id 할당 및 상태 변경
    return this.prisma.channel.update({
      where: { id: channel.id },
      data: {
        user2Id: userId,
        status: 'ACTIVE',
        assistants: { create: { userId } },
      },
      include: { assistants: true },
    });
  }

}
