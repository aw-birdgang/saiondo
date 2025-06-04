import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {InviteCodeChannelDto} from '@modules/channel/dto/invite-code-channel.dto';
import {generateInviteCode} from "@common/utils/invite-code.util";

/**
 * ChannelService
 * - 커플(채널) 생성/조회/삭제/초대코드/상태변경 등
 * - 채널과 관련된 유저, 어시스턴트 정보 관리
 */
@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(ChannelService.name);

  // =========================
  // ===== 생성 관련 메서드 =====
  // =========================

  /** 커플(채널) 생성 + 하위 Assistant 생성 */
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

  // =========================
  // ===== 조회 관련 메서드 =====
  // =========================

  /** 채널 전체 조회 (어시스턴트 포함) */
  async findAll() {
    return this.prisma.channel.findMany({ include: { assistants: true } });
  }

  /** 채널 단건 조회 (어시스턴트 포함) */
  async getChannelById(channelId: string) {
    return this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { assistants: true },
    });
  }

  /** 채널 단건 조회 (어시스턴트 미포함) */
  async findById(channelId: string) {
    return this.prisma.channel.findUnique({
      where: { id: channelId },
    });
  }

  /** 채널 + 유저 정보 조회 */
  async getChannelWithUserInfoById(channelId: string) {
    return this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        user1: true,
        user2: true,
      },
    });
  }

  /** 채널 정보만 조회 */
  async getJustChannelInfoById(channelId: string) {
    return this.prisma.channel.findUnique({
      where: { id: channelId },
    });
  }

  /** 채널 참가자(상대방) userId 조회 */
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

  // =========================
  // ===== 초대코드 관련 메서드 =====
  // =========================

  /** 초대코드 재발급 */
  async inviteCode(dto: InviteCodeChannelDto) {
    const channelId = dto.channelId;
    const inviteCode = generateInviteCode();
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel) {
      throw new NotFoundException('채널을 찾을 수 없습니다.');
    }
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { inviteCode },
    });
  }

  /** 초대코드로 채널 참가 */
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

  // =========================
  // ===== 상태 변경/삭제 관련 =====
  // =========================

  /** 채널 삭제 */
  async remove(id: string) {
    return this.prisma.channel.delete({ where: { id } });
  }

  /** 수락(상태를 ACTIVE로 변경) */
  async accept(channelId: string) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { status: 'ACTIVE' },
    });
  }

  /** 거절/종료(상태를 ENDED로 변경) */
  async reject(channelId: string) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { status: 'ENDED' },
    });
  }

  /** 상태 변경(일반화) */
  async updateStatus(channelId: string, status: string) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { status },
    });
  }
}
