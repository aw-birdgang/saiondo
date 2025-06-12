import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {InviteCodeChannelDto} from '@modules/channel/dto/invite-code-channel.dto';
import {generateInviteCode} from "@common/utils/invite-code.util";
import {CreateChannelDto} from './dto/create-channel.dto';

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

  /** 커플(채널) 생성 + OWNER 멤버 등록 */
  async createChannel(dto: CreateChannelDto) {
    const channel = await this.prisma.channel.create({
      data: {
        inviteCode: dto.inviteCode ?? null,
        status: dto.status ?? 'PENDING',
      },
    });

    // 채널 생성 후 owner 멤버 등록
    await this.prisma.channelMember.create({
      data: {
        channelId: channel.id,
        userId: dto.userId,
        role: 'OWNER',
      },
    });

    return channel;
  }

  // =========================
  // ===== 조회 관련 메서드 =====
  // =========================

  /** 전체 채널 조회 (어시스턴트 포함) */
  async findAll() {
    return this.prisma.channel.findMany({ include: { assistants: true } });
  }

  /** 채널 단건 조회 (멤버 및 유저 정보 포함) */
  async getChannelById(channelId: string) {
    return this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { members: { include: { user: true } } },
    });
  }

  /** 채널 단건 조회 (어시스턴트 미포함) */
  async findById(channelId: string) {
    return this.prisma.channel.findUnique({
      where: { id: channelId },
    });
  }

  /** 채널 정보만 조회 (멤버/어시스턴트 미포함) */
  async getJustChannelInfoById(channelId: string) {
    return this.prisma.channel.findUnique({
      where: { id: channelId },
    });
  }

  /** 채널 참가자(상대방) userId 조회 (2인 채널 기준) */
  async getChannelParticipants(channelId: string, userId: string): Promise<string | null> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { members: { include: { user: true } } },
    });
    if (!channel) return null;

    const owner = channel.members.find(m => m.role === 'OWNER');
    const participant = channel.members.find(m => m.role === 'MEMBER');

    if (owner?.userId === userId) {
      return participant?.userId ?? null;
    } else if (participant?.userId === userId) {
      return owner?.userId ?? null;
    } else {
      return null;
    }
  }

  /** 초대코드로 채널 조회 (멤버 및 유저 정보 포함) */
  async getChannelByInviteCode(inviteCode: string) {
    return this.prisma.channel.findUnique({
      where: { inviteCode },
      include: { members: { include: { user: true } } },
    });
  }

  /** 현재 참여 중인 채널 조회 (상태: PENDING, ACTIVE) */
  async getCurrentChannel(userId: string) {
    return this.prisma.channel.findFirst({
      where: {
        members: {
          some: { userId }
        },
        status: { in: ['PENDING', 'ACTIVE'] },
      },
      include: { members: { include: { user: true } } },
    });
  }

  /** 활성 채널 목록 조회 (상태: PENDING, ACTIVE) */
  async getAvailableChannels() {
    return this.prisma.channel.findMany({
      where: { status: { in: ['PENDING', 'ACTIVE'] } },
    });
  }

  /** 내가 참여한 모든 채널 조회 (멤버 및 유저 정보 포함) */
  async getMyChannels(userId: string) {
    return this.prisma.channel.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: { members: { include: { user: true } } }
    });
  }

  async getChannelByUserId(userId: string) {
    return this.prisma.channel.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
    });
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

  /** 초대코드로 채널 참가 (MEMBER로 추가, 상태 ACTIVE로 변경) */
  async joinByInviteCode(inviteCode: string, participantId: string) {
    const channel = await this.getChannelByInviteCode(inviteCode);
    if (!channel) throw new NotFoundException('초대 코드를 찾을 수 없습니다.');
    const participant = channel.members.find(m => m.role === 'MEMBER');
    if (participant) throw new BadRequestException('이미 참여한 채널입니다.');
    await this.prisma.channelMember.create({
      data: {
        channelId: channel.id,
        userId: participantId,
        role: 'MEMBER',
      },
    });
    return this.prisma.channel.update({
      where: { id: channel.id },
      data: { status: 'ACTIVE' },
    });
  }

  // =========================
  // ===== 상태 변경/삭제 관련 =====
  // =========================

  /** 채널 삭제 */
  async remove(id: string) {
    return this.prisma.channel.delete({ where: { id } });
  }


  /** 채널 상태 변경 (일반화) */
  async updateStatus(channelId: string, status: string) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { status },
    });
  }

  /** 채널에 특정 유저가 멤버인지 확인 */
  async isMember(channelId: string, userId: string) {
    const member = await this.prisma.channelMember.findFirst({
      where: { channelId, userId },
    });
    return !!member;
  }


  /** 멤버 없는(종료된) 채널 정리 */
  async cleanupEmptyChannels() {
    return this.prisma.channel.deleteMany({
      where: {
        status: 'ENDED',
      },
    });
  }

  /** 채널 ID로 참여 (MEMBER로 추가, 상태 ACTIVE로 변경) */
  async joinChannelById(userId: string, channelId: string) {
    const channel = await this.getChannelById(channelId);
    if (!channel) throw new NotFoundException('채널을 찾을 수 없습니다.');
    const participant = channel.members.find(m => m.role === 'MEMBER');
    if (participant) throw new BadRequestException('이미 참여한 채널입니다.');
    await this.prisma.channelMember.create({
      data: {
        channelId,
        userId,
        role: 'MEMBER',
      },
    });
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { status: 'ACTIVE' },
    });
  }


  /** 채널 상태를 ENDED로 변경 (거절/종료) */
  async reject(channelId: string, userId: string) {
    // userId가 해당 채널의 멤버인지, 권한이 있는지 체크 등 추가 가능
    return this.prisma.channel.update({
      where: { id: channelId },
      data: { status: 'ENDED' },
    });
  }

  /** 채널 나가기 (OWNER면 채널 삭제, MEMBER면 멤버만 제거 및 상태 PENDING) */
  async leaveChannel(userId: string) {
    const channel = await this.getCurrentChannel(userId);
    if (!channel) throw new NotFoundException('참여 중인 채널이 없습니다.');
    if (channel.members.find(m => m.role === 'OWNER')?.userId === userId) {
      await this.prisma.channel.delete({ where: { id: channel.id } });
    } else if (channel.members.find(m => m.role === 'MEMBER')?.userId === userId) {
      await this.prisma.channelMember.deleteMany({
        where: { channelId: channel.id, role: 'MEMBER' },
      });
      await this.prisma.channel.update({
        where: { id: channel.id },
        data: { status: 'PENDING' },
      });
    }
    return { success: true };
  }

  /** 채널에서 멤버 제거 */
  async removeMember(channelId: string, userId: string) {
    return this.prisma.channelMember.deleteMany({
      where: { channelId, userId },
    });
  }

  async invite(channelId: string, inviterId: string, inviteeId: string) {
    return this.prisma.invitation.create({
      data: {
        channelId,
        inviterId,
        inviteeId,
        status: 'PENDING',
      },
    });
  }

}
