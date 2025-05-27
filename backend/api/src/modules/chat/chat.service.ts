import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../../common/prisma/prisma.service';
import {ChatWithFeedbackDto} from './dto/chat-with-feedback.dto';
import {CategoryCode, ChatHistory, MessageSender, PersonaProfile, User} from '@prisma/client';
import {LlmService} from '@modules/llm/llm.service';
import {PersonaProfileService} from '@modules/persona-profile/persona-profile.service';
import {ChannelService} from '@modules/channel/channel.service';
import {AssistantService} from '@modules/assistant/assistant.service';
import {loadPromptTemplate} from '../../common/utils/prompt-loader.util';
import {fillPromptTemplate} from '../../common/utils/prompt-template.util';
import {LLMMessageDto} from "@modules/llm/dto/llm-message.dto";
import {ChatHistoryService} from '@modules/chat-history/chat-history.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
    private readonly assistantService: AssistantService,
    private readonly personaProfileService: PersonaProfileService,
    private readonly channelService: ChannelService,
    private readonly chatHistoryService: ChatHistoryService,
  ) {}

  async chatWithFeedback(
    dto: ChatWithFeedbackDto,
  ): Promise<{ userChat: ChatHistory; aiChat: ChatHistory }> {
    const { userId, assistantId, channelId, message } = dto;
    return this.sendToLLM(message, assistantId, channelId, userId, '');
  }

  private async validateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('존재하지 않는 사용자입니다.');
  }

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

  // chatService
  private async getPartnerUser(channelId: string, userId: string): Promise<User | null> {
    this.logger.log(`[ChatService] getPartnerUser channelId: ${channelId}, userId: ${userId}`);
    const partnerId = await this.channelService.getChannelParticipants(channelId, userId);
    if (!partnerId) return null;
    return this.prisma.user.findUnique({ where: { id: partnerId } });
  }

  // categoryCode.description을 사용하여 personaSummary 생성
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

  private async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

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

  private async getChatHistoryMessages(channelId: string, limit = 10) {
    const history = await this.chatHistoryService.findManyByChannel(channelId, limit);
    // 시간순 정렬
    history.reverse();
    return history.map((msg) => ({
      role: msg.sender === 'USER' ? 'user' : 'assistant',
      content: msg.message,
    })) as LLMMessageDto[];
  }

  async processUserMessage(
    userId: string,
    assistantId: string,
    channelId: string,
    message: string,
  ) {
    this.logger.log(`[ChatService] user message: ${message}`);

    // 대화 히스토리 수집
    const chatHistory = await this.getChatHistoryMessagesChannelAndAssistant(channelId, assistantId, 10);
    this.logger.log(`[ChatService] LLM chatHistory: ${JSON.stringify(chatHistory, null, 2)}`);

    // 사용자 메시지 저장
    const userChat = await this.saveChatMessage(
      userId,
      assistantId,
      channelId,
      message,
      MessageSender.USER,
    );

    const partner = await this.getPartnerUser(channelId, userId);
    if (!partner) throw new Error('채팅방 참여자 정보를 찾을 수 없습니다.');

    // 과거 채팅 목록 가져오기
    const personaSummary = await this.getPersonaSummary(partner.id);
    const questioner = await this.getUserById(userId);

    // system 메시지(페르소나 context) 생성
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

    // 전체 메시지 배열 조합 (system + 기존 히스토리 + 이번 user 메시지)
    const messages: LLMMessageDto[] = [
      systemMessage,
      ...chatHistory,
      { role: 'user' as const, content: message },
    ];
    this.logger.log(`[ChatService] LLM 최종 messages: ${JSON.stringify(messages, null, 2)}`);

    // LLM 서버에 히스토리 기반 응답 요청
    const llmResponse = await this.llmService.forwardHistoryToLLM({
      messages,
      model: 'openai', // 또는 'claude'
    });
    this.logger.log(`[ChatService] LLM 응답: ${llmResponse}`);

    // 7. AI 응답 저장
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
}
