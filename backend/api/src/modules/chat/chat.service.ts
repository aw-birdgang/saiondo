import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {ChatWithFeedbackDto} from './dto/chat-with-feedback.dto';
import {CategoryCode, MessageSender, PersonaProfile, User} from '@prisma/client';
import {LlmService} from '@modules/llm/llm.service';
import {ChannelService} from '@modules/channel/channel.service';
import {UserService} from "@modules/user/user.services";
import {BasicQuestionWithAnswerService} from '../basic-question-with-answer/basic-question-with-answer.service';
import {ChatQARelationshipCoachRequestDto} from "@modules/chat/dto/chat_qa_relationship-coach.dto";
import {extractJsonFromCodeBlock} from "@common/utils/json.util";
import {ProfileFeatureDto, SimpleProfileDto, TraitQnADto} from './dto/simple-profile.dto';
import {
  RelationalChatRepository
} from "../../database/chat/infrastructure/persistence/relational/repositories/chat.repository";
import {Chat as DomainChat} from '../../database/chat/domain/chat';
import {CreateChatDto} from "@modules/chat/dto/create-chat.dto";
import {PrismaService} from "@common/prisma/prisma.service";
import { randomUUID } from 'crypto';
import { PointService } from '../point/point.service';
import { PointType } from '@prisma/client';

/**
 * ChatService
 * - 채팅 메시지 저장/조회/피드백
 * - LLM 프롬프트 생성 및 응답 처리
 * - 유저/파트너 프로필 및 trait 분석
 * - 채널/유저/파트너 정보 조회
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly chatRepo: RelationalChatRepository,
    private readonly llmService: LlmService,
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
    private readonly basicQnAService: BasicQuestionWithAnswerService,
    private readonly prisma: PrismaService,
    private readonly pointService: PointService,
  ) {}


  // =========================
  // ===== 채팅 관련 메서드 =====
  // =========================


  async createChat(dto: CreateChatDto): Promise<DomainChat> {
    const chat = new DomainChat();
    chat.id = randomUUID();
    chat.userId = dto.userId;
    chat.assistantId = dto.assistantId;
    chat.channelId = dto.channelId;
    chat.message = dto.message;
    chat.sender = dto.sender;
    chat.createdAt = dto.createdAt ?? new Date();
    return this.chatRepo.save(chat);
  }

  /** LLM 피드백과 함께 채팅 저장 */
  async chatWithFeedback(
    dto: ChatWithFeedbackDto,
  ): Promise<{ userChat: DomainChat; aiChat: DomainChat }> {
    const { userId, assistantId, channelId, message } = dto;
    return this.sendToLLM(message, assistantId, channelId, userId, '');
  }

  async findChatsByChannelWithAssistantId(assistantId: string): Promise<DomainChat[]> {
    const allChats = await this.chatRepo.findAll();
    return allChats.filter(chat => chat.assistantId === assistantId);
  }

  async findManyByChannelAndAssistant(channelId: string, assistantId: string, limit = 10): Promise<DomainChat[]> {
    const allChats = await this.chatRepo.findAll();
    return allChats
      .filter(chat => chat.channelId === channelId && chat.assistantId === assistantId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
      .slice(0, limit);
  }

  /** LLM에 피드백 요청 */
  async sendToLLM(
    message: string,
    assistantId: string,
    channelId: string,
    userId: string,
    prompt: string,
  ): Promise<any> {
    await this.validateUser(userId);
    return await this.llmService.getFeedback(prompt, assistantId);
  }

  /** 채팅 메시지 저장 (ChatService 사용) */
  private async saveChatMessage(
    userId: string,
    assistantId: string,
    channelId: string,
    message: string,
    sender: MessageSender,
  ) {
    return this.createChat({
      userId,
      assistantId,
      channelId,
      message,
      sender,
      createdAt: new Date(),
    });
  }


  /** 최근 채팅 내역을 텍스트로 변환 */
  private async chatHistoryToText(
    channelId: string,
    assistantId: string,
    limit = 10
  ): Promise<string> {
    const history = await this.findManyByChannelAndAssistant(channelId, assistantId, limit);
    history.reverse();
    return history
      .map(msg => `${msg.sender === 'USER' ? '유저' : 'AI'}: ${msg.message}`)
      .join('\n');
  }

  // =========================
  // ===== LLM/프롬프트 관련 =====
  // =========================

  /** 실제 LLM 프롬프트로 코칭/피드백 생성 */
  async processQARelationshipCoachMessage(
    userId: string,
    assistantId: string,
    channelId: string,
    message: string,
    model: 'openai' | 'claude' = 'openai'
  ) {
    // 1. 구독자라면 포인트 차감 없이 통과
    const user = await this.userService.findById(userId);
    const now = new Date();
    if (!user) throw new BadRequestException('존재하지 않는 사용자입니다.');
    const isActiveSub = user.isSubscribed && user.subscriptionUntil && user.subscriptionUntil > now;
    if (!isActiveSub) {
      // 비구독자는 포인트 차감
      const POINT_COST = 5;
      await this.pointService.usePoint(
        userId,
        POINT_COST,
        PointType.CHAT_USE,
        'AI 대화 시도'
      );
    }

    // 병렬로 가져올 수 있는 데이터는 동시에 처리
    const [memorySchema, profileWithPartner, chatHistoryText] = await Promise.all([
      this.getMemorySchema(channelId, userId, assistantId),
      this.getProfileWithPartner(userId, channelId),
      this.chatHistoryToText(channelId, assistantId, 10),
    ]);

    // 유저 메시지 저장
    const userChat = await this.saveChatMessage(
      userId,
      assistantId,
      channelId,
      message,
      MessageSender.USER,
    );

    // 프롬프트 요청 객체 생성
    const relationshipCoachRequest: ChatQARelationshipCoachRequestDto = <ChatQARelationshipCoachRequestDto>{
      memory_schema: memorySchema,
      profile: profileWithPartner,
      chat_history: chatHistoryText,
      messages: [{role: 'user', content: message}],
      model,
    };

    // LLM 호출 및 응답 파싱
    let reply = '';
    let llmResponse = '';
    try {
      llmResponse = await this.llmService.forwardToLLMQAForChatRelationshipCoach(relationshipCoachRequest);
      this.logger.log(`[ChatService] LLM 관계코치 응답: ${llmResponse}`);
      const parsed = extractJsonFromCodeBlock(llmResponse);
      reply = parsed?.reply || '';
    } catch (e) {
      this.logger.error('LLM 응답 파싱 실패:', e);
      reply = '';
    }

    // AI 메시지 저장
    const aiChat = await this.saveChatMessage(
      userId,
      assistantId,
      channelId,
      reply,
      MessageSender.AI,
    );

    return {
      userId,
      assistantId,
      channelId,
      message,
      userChat,
      aiChat,
      llmResponse,
    };
  }

  // =========================
  // ===== 유저/채널 관련 =====
  // =========================

  /** 유저 존재 여부 검증 */
  private async validateUser(userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 사용자입니다.');
  }

  /** 채널에서 상대방 유저 정보 조회 (UserService 사용) */
  private async getPartnerUser(channelId: string, userId: string): Promise<User | null> {
    this.logger.log(`[ChatService] getPartnerUser channelId: ${channelId}, userId: ${userId}`);
    const partnerId = await this.channelService.getChannelParticipants(channelId, userId);
    const user = partnerId ? await this.userService.findById(partnerId) : null;
    if (!user || !user.id) return null;
    return {
      name: user.name,
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? null,
      gender: user.gender,
      email: user.email,
      password: user.password,
      birthDate: user.birthDate,
      fcmToken: user.fcmToken ?? null,
      point: user.point ?? 0,
      walletId: user.walletId ?? null,
      isSubscribed: user.isSubscribed ?? false,
      subscriptionUntil: user.subscriptionUntil ?? null,
    };
  }

  // =========================
  // ===== 프로필/trait 관련 =====
  // =========================

  /** 유저의 페르소나 요약 (카테고리 설명 포함) */
  private async getPersonaSummary(userId: string): Promise<{ key: string; value: string }[]> {
    const personaList: (PersonaProfile & { categoryCode: CategoryCode })[] =
      await this.prisma.personaProfile.findMany({
        where: { userId },
        include: { categoryCode: true },
      });
    if (!personaList?.length) return [];
    return personaList.map((p) => ({
      key: p.categoryCode?.description ?? p.categoryCodeId,
      value: p.content,
    }));
  }

  /** 관계코치용 profile 조회 (user + partner 정보 포함) */
  async getProfileWithPartner(
    userId: string,
    channelId: string
  ): Promise<{ me: SimpleProfileDto; partner: SimpleProfileDto }> {
    const user = await this.userService.findById(userId);
    if (!user) throw new Error('존재하지 않는 사용자입니다.');
    const userPersonaSummary: ProfileFeatureDto[] = await this.getPersonaSummary(userId);

    const partner = await this.getPartnerUser(channelId, userId);
    const partnerPersonaSummary: ProfileFeatureDto[] = partner ? await this.getPersonaSummary(partner.id) : [];
    const userTraitQnA: Record<string, TraitQnADto[]> = await this.analyzeTraitsForUser(userId);
    const partnerTraitQnA: Record<string, TraitQnADto[]> = partner ? await this.analyzeTraitsForUser(partner.id) : {};

    // 빈 프로필 생성 함수
    const emptyProfile = (): SimpleProfileDto => ({
      이름: '',
      성별: '',
      생년월일: new Date(0),
      특징: [],
      trait_qna: {},
    });

    return {
      me: {
        이름: user.name ?? '',
        성별: typeof user.gender === 'string' ? user.gender : String(user.gender ?? ''),
        생년월일: user.birthDate ?? new Date(0),
        특징: userPersonaSummary ?? [],
        trait_qna: userTraitQnA ?? {},
      },
      partner: partner
        ? {
            이름: partner.name ?? '',
            성별: typeof partner.gender === 'string' ? partner.gender : String(partner.gender ?? ''),
            생년월일: partner.birthDate ?? new Date(0),
            특징: partnerPersonaSummary ?? [],
            trait_qna: partnerTraitQnA ?? {},
          }
        : emptyProfile(),
    };
  }

  /** 유저 trait QnA 분석 */
  async analyzeTraitsForUser(userId: string) {
    const answered = await this.basicQnAService.getAnsweredQAPairs(userId);

    // 기존 getCategories 함수 사용
    const categories = await this.basicQnAService.getCategories();
    const categoryIdToName = Object.fromEntries(categories.map(cat => [cat.id, cat.name]));

    const map: Record<string, { question: string; answer: string }[]> = {};
    for (const qa of answered) {
      const categoryName = categoryIdToName[qa.categoryId] || qa.categoryId;
      if (!map[categoryName]) map[categoryName] = [];
      map[categoryName].push({ question: qa.question, answer: qa.answer });
    }
    return map;
  }

  // =========================
  // ===== 메모리 스키마 관련 =====
  // =========================

  /** 관계코치용 memory_schema 조회 (예시) */
  async getMemorySchema(channelId: string, userId: string, assistantId: string): Promise<Record<string, any>> {
    // 실제 서비스 상황에 맞게 필요한 정보만 포함
    // 예: 채널명, 생성일, 유저/assistant 닉네임 등
    const channel = await this.channelService.findById(channelId);
    const user = await this.userService.findById(userId);
    const assistant = await this.userService.findById(assistantId);

    return {
      // 필요한 필드만 추가
    };
  }
}
