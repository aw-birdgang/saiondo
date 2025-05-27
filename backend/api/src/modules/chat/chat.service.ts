import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ChatWithFeedbackDto } from './dto/chat-with-feedback.dto';
import { ChatHistory, MessageSender, PersonaProfile, User, CategoryCode } from '@prisma/client';
import { LlmService } from '@modules/llm/llm.service';
import { PersonaProfileService } from '@modules/persona-profile/persona-profile.service';
import { ChannelService } from '@modules/channel/channel.service';
import { AssistantService } from '@modules/assistant/assistant.service';

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
  ): Promise<{ userChat: ChatHistory; aiChat: ChatHistory }> {
    await this.validateUser(userId);
    const userChat = await this.saveChatMessage(
      userId,
      assistantId,
      channelId,
      message,
      MessageSender.USER,
    );
    const llmResponse = await this.llmService.getFeedback(prompt, assistantId);
    const aiChat = await this.saveChatMessage(
      userId,
      assistantId,
      channelId,
      llmResponse,
      MessageSender.AI,
    );
    return { userChat, aiChat };
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
    return `
아래의 사용자 특징과 페르소나는 참고만 하세요. 
답변에는 절대 직접적으로 언급하지 마세요. 
질문에 대해 간결하고 실질적인 조언만 해주세요.
답변은 3~4문장 이내로 해주세요.

질문자: ${questioner?.gender ?? '정보없음'}
상대방: ${partner.gender ?? '정보없음'}
상대방 특징: ${personaSummary}
질문: ${message}
`.trim();
  }

  async processUserMessage(
    userId: string,
    assistantId: string,
    channelId: string,
    message: string,
  ) {
    const partner = await this.getPartnerUser(channelId, userId);
    if (!partner) throw new Error('채팅방 참여자 정보를 찾을 수 없습니다.');

    const personaSummary = await this.getPersonaSummary(partner.id);
    const questioner = await this.getUserById(userId);
    const prompt = this.buildPrompt(questioner, partner, personaSummary, message);

    this.logger.log(`[ChatService] LLM Prompt: ${prompt}`);

    const { userChat, aiChat } = await this.sendToLLM(
      message,
      assistantId,
      channelId,
      userId,
      prompt,
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
