import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../../common/prisma/prisma.service';
import {ChatWithFeedbackDto} from './dto/chat-with-feedback.dto';
import {CategoryCode, ChatHistory, MessageSender, PersonaProfile, User} from '@prisma/client';
import {LlmService} from '@modules/llm/llm.service';
import {ChannelService} from '@modules/channel/channel.service';
import {loadPromptTemplate} from '../../common/utils/prompt-loader.util';
import {fillPromptTemplate} from '../../common/utils/prompt-template.util';
import {LLMMessageDto} from "@modules/llm/dto/llm-message.dto";
import {ChatHistoryService} from '@modules/chat-history/chat-history.service';
import {UserService} from "@modules/user/user.services";
import {RelationshipCoachRequestDto} from "@modules/chat/dto/chat_relationship-coach.dto";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
    private readonly channelService: ChannelService,
    private readonly chatHistoryService: ChatHistoryService,
    private readonly userService: UserService,
  ) {}

  /**
   * LLM 피드백과 함께 채팅 저장
   */
  async chatWithFeedback(
    dto: ChatWithFeedbackDto,
  ): Promise<{ userChat: ChatHistory; aiChat: ChatHistory }> {
    const { userId, assistantId, channelId, message } = dto;
    return this.sendToLLM(message, assistantId, channelId, userId, '');
  }

  /**
   * 유저 존재 여부 검증
   */
  private async validateUser(userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 사용자입니다.');
  }

  /**
   * 채팅 메시지 저장 (ChatHistoryService 사용)
   */
  private async saveChatMessage(
    userId: string,
    assistantId: string,
    channelId: string,
    message: string,
    sender: MessageSender,
  ) {
    return this.chatHistoryService.create({
      userId,
      assistantId,
      channelId,
      message,
      sender,
      createdAt: new Date(),
    });
  }

  /**
   * LLM에 피드백 요청
   */
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

  /**
   * 채널에서 상대방 유저 정보 조회 (UserService 사용)
   */
  private async getPartnerUser(channelId: string, userId: string): Promise<User | null> {
    this.logger.log(`[ChatService] getPartnerUser channelId: ${channelId}, userId: ${userId}`);
    const partnerId = await this.channelService.getChannelParticipants(channelId, userId);
    if (!partnerId) return null;
    return this.userService.findById(partnerId);
  }

  /**
   * 유저의 페르소나 요약 문자열 생성 (카테고리 설명 포함)
   */
  private async getPersonaSummary(userId: string): Promise<string> {
    // categoryCode도 함께 include
    const personaList: (PersonaProfile & { categoryCode: CategoryCode })[] =
      await this.prisma.personaProfile.findMany({
        where: { userId },
        include: { categoryCode: true },
      });
    if (!personaList || personaList.length === 0) return '정보없음';
    // [카테고리 설명]: [값] 형태로 조합
    return personaList
      .map((p) => `${p.categoryCode?.description ?? p.categoryCodeId}: ${p.content}`)
      .join(', ');
  }

  /**
   * 유저 정보 조회 (UserService 사용)
   */
  private async getUserById(userId: string): Promise<User | null> {
    return this.userService.findById(userId);
  }

  /**
   * 프롬프트 템플릿을 불러와 변수 치환
   */
  private buildPrompt(
    questioner: User | null,
    partner: User,
    personaSummary: string,
    message: string,
  ): string {
    const template = loadPromptTemplate('default');
    return fillPromptTemplate(template, {
      questionerGender: questioner?.gender ?? '정보없음',
      partnerGender: partner.gender ?? '정보없음',
      personaSummary,
      message,
    }).trim();
  }

  /**
   * 특정 채널/assistant의 최근 채팅 히스토리 조회 및 LLMMessageDto 변환
   */
  private async getChatHistoryMessagesChannelAndAssistant(
      channelId: string,
      assistantId: string,
      limit = 10
  ): Promise<LLMMessageDto[]> {
    const history = await this.chatHistoryService.findManyByChannelAndAssistant(channelId, assistantId, limit);
    history.reverse();
    return history.map((msg) => ({
      role: msg.sender === 'USER' ? 'user' : 'assistant',
      content: msg.message,
    })) as LLMMessageDto[];
  }

  /**
   * 사용자 메시지 처리 및 LLM 응답 생성 전체 플로우
   */
  async processUserMessage(
      userId: string,
      assistantId: string,
      channelId: string,
      message: string,
  ) {
    this.logger.log(`[ChatService] user message: ${message}`);

    // 1. 대화 히스토리 수집
    const chatHistory = await this.getChatHistoryMessagesChannelAndAssistant(channelId, assistantId, 10);
    this.logger.log(`[ChatService] LLM chatHistory: ${JSON.stringify(chatHistory, null, 2)}`);

    // 2. 사용자 메시지 저장
    const userChat = await this.saveChatMessage(
        userId,
        assistantId,
        channelId,
        message,
        MessageSender.USER,
    );

    // 3. 상대방 유저 정보 조회
    const partner = await this.getPartnerUser(channelId, userId);
    if (!partner) throw new Error('채팅방 참여자 정보를 찾을 수 없습니다.');

    // 4. 페르소나 요약 및 질문자 정보 조회
    const personaSummary = await this.getPersonaSummary(partner.id);
    const questioner = await this.getUserById(userId);

    // 5. system 메시지(페르소나 context) 생성
    const personaContextTemplate = loadPromptTemplate('persona_context');
    const personaContext = fillPromptTemplate(personaContextTemplate, {
      questionerGender: questioner?.gender ?? '정보없음',
      partnerGender: partner.gender ?? '정보없음',
      personaSummary,
    });

    const systemMessage: LLMMessageDto = {
      role: 'system',
      content: `너는 친절한 AI 비서야.\n${personaContext}`,
    };

    // 6. 전체 메시지 배열 조합 (system + 기존 히스토리 + 이번 user 메시지)
    const messages: LLMMessageDto[] = [
      systemMessage,
      ...chatHistory,
      { role: 'user' as const, content: message },
    ];
    this.logger.log(`[ChatService] LLM 최종 messages: ${JSON.stringify(messages, null, 2)}`);

    // 7. LLM 서버에 히스토리 기반 응답 요청
    const llmResponse = await this.llmService.forwardHistoryToLLM({
      messages,
      model: 'openai', // 또는 'claude'
    });
    this.logger.log(`[ChatService] LLM 응답: ${llmResponse}`);

    // 8. AI 응답 저장
    const aiChat = await this.saveChatMessage(
        userId,
        assistantId,
        channelId,
        llmResponse,
        MessageSender.AI,
    );

    return {
      userId,
      assistantId,
      channelId,
      message,
      userChat,
      aiChat,
    };
  }

  /**
   * 관계 코치 LLM 상담 전체 플로우
   */
  async processRelationshipCoachMessage(
    userId: string,
    assistantId: string,
    channelId: string,
    message: string,
    model: 'openai' | 'claude' = 'openai'
  ) {
    this.logger.log(`[ChatService] user message (relationship coach): ${message}`);

    // 1. 필요한 정보 서버 내부에서 조회
    const memory_schema = await this.getMemorySchema(channelId, userId, assistantId);
    const profile = await this.getProfileWithPartner(userId, channelId);
    const summary = await this.getConversationSummary(channelId, userId);

    // 2. 대화 히스토리 수집
    const chatHistory = await this.getChatHistoryMessagesChannelAndAssistant(channelId, assistantId, 10);
    this.logger.log(`[ChatService] LLM chatHistory: ${JSON.stringify(chatHistory, null, 2)}`);

    // 3. 사용자 메시지 저장
    const userChat = await this.saveChatMessage(
      userId,
      assistantId,
      channelId,
      message,
      MessageSender.USER,
    );

    // 4. RelationshipCoachRequestDto 조립
    const relationshipCoachRequest: RelationshipCoachRequestDto = {
      memory_schema,
      profile,
      summary,
      messages: [
        ...chatHistory,
        { role: 'user', content: message }
      ],
      model,
    };

    // 5. LLM 서버에 관계코치 프롬프트 기반 응답 요청
    const llmResponse = await this.llmService.forwardToLLMForChatRelationshipCoach(relationshipCoachRequest);
    this.logger.log(`[ChatService] LLM 관계코치 응답: ${llmResponse}`);

    // 6. AI 응답 저장
    const aiChat = await this.saveChatMessage(
      userId,
      assistantId,
      channelId,
      llmResponse,
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

  /**
   * 관계코치용 memory_schema 조회 (예시)
   */
  async getMemorySchema(channelId: string, userId: string, assistantId: string): Promise<Record<string, any>> {
    // 실제 서비스 상황에 맞게 구현
    // 예: 채널/유저/assistant 관련 메타 정보, 최근 대화 요약 등
    return {
      channelId,
      userId,
      assistantId,
      // ... 기타 필요한 정보
    };
  }

  /**
   * 관계코치용 profile 조회 (user + partner 정보 포함)
   */
  async getProfileWithPartner(userId: string, channelId: string): Promise<Record<string, any>> {
    // 본인 정보
    const user = await this.userService.findById(userId);
    const userPersonaSummary = await this.getPersonaSummary(userId);

    // 파트너 정보
    const partner = await this.getPartnerUser(channelId, userId);
    let partnerPersonaSummary = '';
    if (partner) {
      partnerPersonaSummary = await this.getPersonaSummary(partner.id);
    }

    return {
      user: {
        id: user?.id,
        name: user?.name,
        gender: user?.gender,
        birthDate: user?.birthDate,
        personaSummary: userPersonaSummary,
      },
      partner: partner
        ? {
            id: partner.id,
            name: partner.name,
            gender: partner.gender,
            birthDate: partner.birthDate,
            personaSummary: partnerPersonaSummary,
          }
        : null,
      channelId,
      // 필요하다면 relationshipStatus, anniversary 등도 추가
    };
  }

  /**
   * 관계코치용 대화 요약 조회 (예시)
   */
  async getConversationSummary(channelId: string, userId: string): Promise<string> {
    // 실제 서비스 상황에 맞게 구현
    // 예: 최근 대화 요약, 감정 상태 등
    // 여기서는 예시로 최근 10개 메시지를 단순 합침
    const history = await this.chatHistoryService.findManyByChannelAndUser(channelId, userId, 10);
    return history.map(h => h.message).join(' / ');
  }
}
