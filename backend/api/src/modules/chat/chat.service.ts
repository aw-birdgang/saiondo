import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatWithFeedbackDto } from './dto/chat-with-feedback.dto';
import { MessageSender, User } from '@prisma/client';
import { LlmService } from '@modules/llm/llm.service';
import { ChannelService } from '@modules/channel/channel.service';
import { UserService } from '@modules/user/user.services';
import { BasicQuestionWithAnswerService } from '../basic-question-with-answer/basic-question-with-answer.service';
import { ChatQARelationshipCoachRequestDto } from '@modules/chat/dto/chat_qa_relationship-coach.dto';
import { ProfileFeatureDto, SimpleProfileDto, TraitQnADto } from './dto/simple-profile.dto';
import { RelationalChatRepository } from '../../database/chat/infrastructure/persistence/relational/repositories/chat.repository';
import { Chat as DomainChat } from '../../database/chat/domain/chat';
import { CreateChatDto } from '@modules/chat/dto/create-chat.dto';
import { PrismaService } from '@common/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { PointService } from '../point/point.service';

import { createWinstonLogger } from '@common/logger/winston.logger';
import { extractJsonFromCodeBlock } from '@common/utils/json.util';

/**
 * ChatService
 * - 채팅 메시지 저장/조회/피드백
 * - LLM 프롬프트 생성 및 응답 처리
 * - 유저/파트너 프로필 및 trait 분석
 * - 채널/유저/파트너 정보 조회
 */
@Injectable()
export class ChatService {
  private readonly logger = createWinstonLogger(ChatService.name);

  constructor(
    private readonly chatRepository: RelationalChatRepository,
    private readonly llmService: LlmService,
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
    private readonly basicQuestionWithAnswerService: BasicQuestionWithAnswerService,
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

    return this.chatRepository.save(chat);
  }

  /** LLM 피드백과 함께 채팅 저장 */
  async chatWithFeedback(
    dto: ChatWithFeedbackDto,
  ): Promise<{ userChat: DomainChat; aiChat: DomainChat }> {
    const { userId, assistantId, channelId, message } = dto;

    return this.sendToLLM(message, assistantId, channelId, userId);
  }

  async findChatsByChannelWithAssistantId(assistantId: string): Promise<DomainChat[]> {
    const allChats = await this.chatRepository.findAll();

    return allChats.filter(chat => chat.assistantId === assistantId);
  }

  async findManyByChannelAndAssistant(
    channelId: string,
    assistantId: string,
    limit = 10,
  ): Promise<DomainChat[]> {
    const allChats = await this.chatRepository.findAll();

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
  ): Promise<any> {
    await this.validateUser(userId);

    return await this.llmService.getFeedback(message, channelId);
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
    limit = 10,
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
    model: 'openai' | 'claude' = 'openai',
  ) {
    try {
      this.logger.log(
        `AI 코칭 메시지 처리 시작: userId=${userId}, assistantId=${assistantId}, channelId=${channelId}, model=${model}`,
      );

      // 1. 구독자 체크 및 포인트 차감
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new BadRequestException('존재하지 않는 사용자입니다.');
      }

      const now = new Date();
      const isActiveSub =
        user.isSubscribed && user.subscriptionUntil && user.subscriptionUntil > now;

      if (isActiveSub) {
        this.logger.log(`구독자 - 포인트 차감 없음: userId=${userId}`);
      } else {
        const POINT_COST = 5;

        await this.pointService.usePoint(userId, POINT_COST, 'CHAT_USE', 'AI 대화 시도');
        this.logger.log(`포인트 차감 완료: userId=${userId}, pointCost=${POINT_COST}`);
      }

      // 2. 병렬 데이터 조회
      const [memorySchema, profileWithPartner, chatHistoryText] = await Promise.all([
        this.getMemorySchema(channelId, userId, assistantId),
        this.getProfileWithPartner(userId, channelId),
        this.chatHistoryToText(channelId, assistantId, 10),
      ]);

      // 3. 유저 메시지 저장
      const userChat = await this.saveChatMessage(
        userId,
        assistantId,
        channelId,
        message,
        MessageSender.USER,
      );

      // 4. LLM 요청 객체 생성
      const relationshipCoachRequest: ChatQARelationshipCoachRequestDto = <
        ChatQARelationshipCoachRequestDto
      >{
        memory_schema: memorySchema,
        profile: profileWithPartner,
        chat_history: chatHistoryText,
        messages: [{ role: 'user', content: message }],
        model,
      };

      // 5. LLM 호출 및 응답 파싱
      let reply = '';
      let llmResponse = '';

      try {
        this.logger.log(`[Chat] LLM 호출 시작: model=${model}`);

        const response =
          await this.llmService.forwardToLLMQAForChatRelationshipCoach(relationshipCoachRequest);

        llmResponse = response;

        this.logger.log(`[Chat] LLM 원본 응답: ${llmResponse}`);
        this.logger.log(
          `[Chat] LLM 응답 타입: ${typeof llmResponse}, 응답 길이: ${llmResponse.length}`,
        );

        // JSON 응답 파싱
        const parsedResponse = extractJsonFromCodeBlock(llmResponse);

        this.logger.log(`[Chat] JSON 파싱 결과: ${JSON.stringify(parsedResponse)}`);
        this.logger.log(`[Chat] 파싱 성공 여부: ${!!parsedResponse}`);

        if (parsedResponse?.reply) {
          reply = parsedResponse.reply;
          this.logger.log(`[Chat] 파싱된 reply 사용: ${reply}`);
        } else {
          reply = llmResponse;
          this.logger.log(`[Chat] 원본 응답 사용: ${reply}`);
        }

        this.logger.log(
          `[Chat] LLM 응답 파싱 완료: hasParsedResponse=${!!parsedResponse}, reply 길이=${reply.length}`,
        );
      } catch (llmError) {
        this.logger.error(`[Chat] LLM 호출 실패: ${llmError}`, llmError);
        reply = '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }

      // 6. 어시스턴트 응답 저장
      const assistantChat = await this.saveChatMessage(
        assistantId,
        assistantId,
        channelId,
        reply,
        MessageSender.AI,
      );

      this.logger.log(
        `AI 코칭 메시지 처리 완료: userId=${userId}, assistantId=${assistantId}, channelId=${channelId}, userMessageLength=${message.length}, assistantMessageLength=${reply.length}`,
      );

      return {
        userMessage: userChat,
        assistantMessage: assistantChat,
        llmResponse,
      };
    } catch (error) {
      this.logger.error('AI 코칭 메시지 처리 실패:', error);
      throw error;
    }
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

    if (!user?.id) return null;

    // Since we've checked that user.id exists, we can safely return the user
    return user as unknown as User & { id: string };
  }

  // =========================
  // ===== 프로필/trait 관련 =====
  // =========================

  /** 유저의 페르소나 요약 (카테고리 설명 포함) */
  private async getPersonaSummary(userId: string): Promise<{ key: string; value: string }[]> {
    const personaList = await this.prisma.personaProfile.findMany({
      where: { userId },
      include: { categoryCode: true },
    });

    if (!personaList?.length) return [];

    return personaList.map(p => ({
      key: p.categoryCode?.description ?? p.categoryCodeId,
      value: p.content,
    }));
  }

  /** 관계코치용 profile 조회 (user + partner 정보 포함) */
  async getProfileWithPartner(
    userId: string,
    channelId: string,
  ): Promise<{ me: SimpleProfileDto; partner: SimpleProfileDto }> {
    const user = await this.userService.findById(userId);

    if (!user) throw new Error('존재하지 않는 사용자입니다.');
    const userPersonaSummary: ProfileFeatureDto[] = await this.getPersonaSummary(userId);

    const partner = await this.getPartnerUser(channelId, userId);
    const partnerPersonaSummary: ProfileFeatureDto[] = partner?.id
      ? await this.getPersonaSummary(partner.id)
      : [];
    const userTraitQnA: Record<string, TraitQnADto[]> = await this.analyzeTraitsForUser(userId);
    const partnerTraitQnA: Record<string, TraitQnADto[]> = partner?.id
      ? await this.analyzeTraitsForUser(partner.id)
      : {};

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
            성별:
              typeof partner.gender === 'string' ? partner.gender : String(partner.gender ?? ''),
            생년월일: partner.birthDate ?? new Date(0),
            특징: partnerPersonaSummary ?? [],
            trait_qna: partnerTraitQnA ?? {},
          }
        : emptyProfile(),
    };
  }

  /** 유저 trait QnA 분석 */
  async analyzeTraitsForUser(userId: string) {
    const answered = await this.basicQuestionWithAnswerService.getAnsweredQAPairs(userId);

    // 기존 getCategories 함수 사용
    const categories = await this.basicQuestionWithAnswerService.getCategories();
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
  async getMemorySchema(
    channelId: string,
    userId: string,
    assistantId: string,
  ): Promise<Record<string, any>> {
    // 실제 서비스 상황에 맞게 필요한 정보만 포함
    // 예: 채널명, 생성일, 유저/assistant 닉네임 등
    await this.channelService.findById(channelId);
    await this.userService.findById(userId);
    await this.userService.findById(assistantId);

    return {
      // 필요한 필드만 추가
    };
  }
}
