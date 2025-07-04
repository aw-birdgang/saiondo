import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InviteCodeChannelDto} from '@modules/channel/dto/invite-code-channel.dto';
import {generateInviteCode} from "@common/utils/invite-code.util";
import {CreateChannelDto} from './dto/create-channel.dto';
import {Channel} from './../../database/channel/domain/channel';
import {
  RelationalChannelRepository
} from "../../database/channel/infrastructure/persistence/relational/repositories/channel.repository";
import { RedisService } from '@common/redis/redis.service';

/**
 * ChannelService
 * - 커플(채널) 생성/조회/삭제/초대코드/상태변경 등
 * - 채널과 관련된 유저, 어시스턴트 정보 관리
 */
@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);

  constructor(
    private readonly channelRepo: RelationalChannelRepository,
    private readonly redisService: RedisService,
  ) {}

  // =========================
  // ===== 생성 관련 메서드 =====
  // =========================

  /** 커플(채널) 생성 + OWNER 멤버 등록 */
  async createChannel(dto: CreateChannelDto) {
    const channel = new Channel();
    channel.createdAt = new Date();
    channel.updatedAt = new Date();
    channel.inviteCode = dto.inviteCode ?? generateInviteCode();
    channel.status = dto.status ?? 'PENDING';
    channel.deletedAt = null;
    channel.assistants = [];
    channel.advices = [];
    channel.chatHistories = [];
    channel.coupleAnalyses = [];
    channel.members = [];
    channel.invitations = [];

    const saved = await this.channelRepo.save(channel);
    await this.channelRepo.addMember(saved.id, dto.userId, 'OWNER');
    return saved;
  }

  // =========================
  // ===== 조회 관련 메서드 =====
  // =========================

  /** 전체 채널 조회 (어시스턴트 포함) */
  async findAll() {
    return this.channelRepo.findAllWithAssistants();
  }

  /** 채널 단건 조회 (멤버 및 유저 정보 포함) */
  async getChannelById(channelId: string) {
    return this.channelRepo.findByIdWithMembers(channelId);
  }

  /** 채널 단건 조회 (어시스턴트 미포함) */
  async findById(channelId: string) {
    return this.channelRepo.findById(channelId);
  }

  /** 채널 정보만 조회 (멤버/어시스턴트 미포함) */
  async getJustChannelInfoById(channelId: string) {
    return this.channelRepo.findById(channelId);
  }

  /** 채널 참가자(상대방) userId 조회 (2인 채널 기준) */
  async getChannelParticipants(channelId: string, userId: string): Promise<string | null> {
    const channel = await this.channelRepo.findByIdWithMembers(channelId);
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

  /** 초대코드로 채널 조회 (캐시 적용, 로그 포함) */
  async getChannelByInviteCode(inviteCode: string) {
    const redisKey = `channel:invite:${inviteCode}`;

    // 1. Redis에서 먼저 조회 (로그 자동 출력)
    const cached = await this.redisService.get(redisKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. 없으면 DB 조회 후 캐시 저장
    const channel = await this.channelRepo.findByInviteCodeWithMembers(inviteCode);
    if (!channel) throw new NotFoundException('초대코드에 해당하는 채널이 없습니다.');

    await this.redisService.set(redisKey, JSON.stringify(channel), 'EX', 60 * 5); // 5분 캐시
    return channel;
  }

  /** 현재 참여 중인 채널 조회 (상태: PENDING, ACTIVE) */
  async getCurrentChannel(userId: string) {
    return this.channelRepo.findFirstCurrentChannel(userId);
  }

  /** 활성 채널 목록 조회 (상태: PENDING, ACTIVE) */
  async getAvailableChannels() {
    return this.channelRepo.findAvailableChannels();
  }

  /** 내가 참여한 모든 채널 조회 (멤버 및 유저 정보 포함) */
  async getMyChannels(userId: string) {
    return this.channelRepo.findMyChannels(userId);
  }

  async getChannelByUserId(userId: string) {
    return this.channelRepo.findByUserId(userId);
  }

  // =========================
  // ===== 초대코드 관련 메서드 =====
  // =========================

  /** 초대코드 재발급 (캐시 삭제 로그 포함) */
  async inviteCode(dto: InviteCodeChannelDto) {
    const channelId = dto.channelId;
    const inviteCode = generateInviteCode();
    const channel = await this.channelRepo.findById(channelId);
    if (!channel) throw new NotFoundException('채널을 찾을 수 없습니다.');

    // 기존 캐시 삭제 (로그 자동 출력)
    await this.redisService.del(`channel:invite:${channel.inviteCode}`);

    return this.channelRepo.updateInviteCode(channelId, inviteCode);
  }

  /** 초대코드로 채널 참가 (MEMBER로 추가, 상태 ACTIVE로 변경, 중복 방지 로그 포함) */
  async joinByInviteCode(inviteCode: string, participantId: string) {
    const redisKey = `invite:used:${inviteCode}`;

    // 이미 사용된 초대코드인지 체크 (로그 자동 출력)
    const used = await this.redisService.get(redisKey);
    if (used) throw new BadRequestException('이미 사용된 초대코드입니다.');

    const channel = await this.channelRepo.findByInviteCodeWithMembers(inviteCode);
    if (!channel) throw new NotFoundException('초대 코드를 찾을 수 없습니다.');
    const participant = channel.members.find(m => m.role === 'MEMBER');
    if (participant) throw new BadRequestException('이미 참여한 채널입니다.');
    await this.channelRepo.addMember(channel.id, participantId, 'MEMBER');
    await this.redisService.set(redisKey, '1', 'EX', 60 * 10); // 10분간 재사용 방지 (로그 자동 출력)
    return this.channelRepo.updateStatus(channel.id, 'ACTIVE');
  }

  // =========================
  // ===== 상태 변경/삭제 관련 =====
  // =========================

  /** 채널 삭제 */
  async remove(id: string) {
    await this.channelRepo.delete(id);
  }

  /** 채널 상태 변경 (일반화) */
  async updateStatus(channelId: string, status: string) {
    return this.channelRepo.updateStatus(channelId, status);
  }

  /** 채널에 특정 유저가 멤버인지 확인 */
  async isMember(channelId: string, userId: string) {
    return this.channelRepo.isMember(channelId, userId);
  }

  /** 멤버 없는(종료된) 채널 정리 */
  async cleanupEmptyChannels() {
    return this.channelRepo.cleanupEmptyChannels();
  }

  /** 채널 ID로 참여 (MEMBER로 추가, 상태 ACTIVE로 변경) */
  async joinChannelById(userId: string, channelId: string) {
    const channel = await this.channelRepo.findByIdWithMembers(channelId);
    if (!channel) throw new NotFoundException('채널을 찾을 수 없습니다.');
    const participant = channel.members.find(m => m.role === 'MEMBER');
    if (participant) throw new BadRequestException('이미 참여한 채널입니다.');
    await this.channelRepo.addMember(channelId, userId, 'MEMBER');
    return this.channelRepo.updateStatus(channelId, 'ACTIVE');
  }

  /** 채널 상태를 ENDED로 변경 (거절/종료) */
  async reject(channelId: string, userId: string) {
    // userId가 해당 채널의 멤버인지, 권한이 있는지 체크 등 추가 가능
    return this.channelRepo.updateStatus(channelId, 'ENDED');
  }

  /** 채널 나가기 (OWNER면 채널 삭제, MEMBER면 멤버만 제거 및 상태 PENDING) */
  async leaveChannel(userId: string) {
    const channel = await this.channelRepo.findFirstCurrentChannel(userId);
    if (!channel) throw new NotFoundException('참여 중인 채널이 없습니다.');
    if (channel.members.find(m => m.role === 'OWNER')?.userId === userId) {
      await this.channelRepo.delete(channel.id);
    } else if (channel.members.find(m => m.role === 'MEMBER')?.userId === userId) {
      await this.channelRepo.removeMember(channel.id, userId);
      await this.channelRepo.updateStatus(channel.id, 'PENDING');
    }
    return { success: true };
  }

  /** 채널에서 멤버 제거 */
  async removeMember(channelId: string, userId: string) {
    return this.channelRepo.removeMember(channelId, userId);
  }

  async invite(channelId: string, inviterId: string, inviteeId: string) {
    return this.channelRepo.createInvitation(channelId, inviterId, inviteeId);
  }

  // 도메인 기반 메서드 예시
  async getChannel(id: string): Promise<Channel | null> {
    return this.channelRepo.findById(id);
  }
}
