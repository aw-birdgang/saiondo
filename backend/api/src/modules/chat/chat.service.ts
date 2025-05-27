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

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
    private readonly assistantService: AssistantService,
    private readonly personaProfileService: PersonaProfileService,
    private readonly channelService: ChannelService,
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
  ): Promise<ChatHistory> {
    return this.prisma.chatHistory.create({
      data: { userId, assistantId, channelId, message, sender },
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

  async processUserMessage(
    userId: string,
    assistantId: string,
    channelId: string,
    message: string,
  ) {
    this.logger.log(`[ChatService] user message: ${message}`);
    // user 메시지 저장
    const userChat = await this.saveChatMessage(
        userId,
        assistantId,
        channelId,
        message,
        MessageSender.USER,
    );

    const partner = await this.getPartnerUser(channelId, userId);
    if (!partner) throw new Error('채팅방 참여자 정보를 찾을 수 없습니다.');

    const personaSummary = await this.getPersonaSummary(partner.id);
    const questioner = await this.getUserById(userId);
    const prompt = this.buildPrompt(questioner, partner, personaSummary, message);
    this.logger.log(`[ChatService] LLM Prompt: ${prompt}`);

    // ai 피드백 저장
    const llmResponse = await this.sendToLLM(
      message,
      assistantId,
      channelId,
      userId,
      prompt,
    );
    this.logger.log(`[ChatService] LLM llmResponse: ${llmResponse}`);

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
