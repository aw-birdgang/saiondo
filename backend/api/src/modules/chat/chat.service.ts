import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../../common/prisma/prisma.service';
import {ChatWithFeedbackDto} from './dto/chat-with-feedback.dto';
import {CategoryCode, ChatHistory, MessageSender, PersonaProfile, User} from '@prisma/client';
import {LlmService} from '@modules/llm/llm.service';
import {ChannelService} from '@modules/channel/channel.service';
import {ChatHistoryService} from '@modules/chat-history/chat-history.service';
import {UserService} from "@modules/user/user.services";
import {BasicQuestionWithAnswerService} from '../basic-question-with-answer/basic-question-with-answer.service';
import {ChatQARelationshipCoachRequestDto} from "@modules/chat/dto/chat_qa_relationship-coach.dto";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
    private readonly channelService: ChannelService,
    private readonly chatHistoryService: ChatHistoryService,
    private readonly userService: UserService,
    private readonly basicQnAService: BasicQuestionWithAnswerService,
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
    return partnerId ? this.userService.findById(partnerId) : null;
  }

  /**
   * 유저의 페르소나 요약 문자열 생성 (카테고리 설명 포함)
   */
  private async getPersonaSummary(userId: string): Promise<string> {
    const personaList: (PersonaProfile & { categoryCode: CategoryCode })[] =
      await this.prisma.personaProfile.findMany({
        where: { userId },
        include: { categoryCode: true },
      });
    if (!personaList?.length) return '정보없음';
    return personaList
      .map((p) => `${p.categoryCode?.description ?? p.categoryCodeId}: ${p.content}`)
      .join(', ');
  }

  private async chatHistoryToText(
      channelId: string,
      assistantId: string,
      limit = 10
  ): Promise<string> {
    const history = await this.chatHistoryService.findManyByChannelAndAssistant(channelId, assistantId, limit);
    history.reverse();
    return history
        .map(msg => `${msg.sender === 'USER' ? '유저' : 'AI'}: ${msg.message}`)
        .join('\n');
  }


  /**
   * 실제 LLM 프롬프트로 코칭/피드백 생성
   */
  async processQARelationshipCoachMessage(
      userId: string,
      assistantId: string,
      channelId: string,
      message: string,
      model: 'openai' | 'claude' = 'openai'
  ) {
    const memory_schema = await this.getMemorySchema(channelId, userId, assistantId);
    const profile = await this.getProfileWithPartner(userId, channelId);
    const chatHistoryText = await this.chatHistoryToText(channelId, assistantId, 10);

    const userChat = await this.saveChatMessage(
        userId,
        assistantId,
        channelId,
        message,
        MessageSender.USER,
    );

    const relationshipCoachRequest: ChatQARelationshipCoachRequestDto = <ChatQARelationshipCoachRequestDto>{
      memory_schema,
      profile,
      chat_history: chatHistoryText,
      messages: [
        {role: 'user', content: message}
      ],
      model,
    };

    const llmResponse = await this.llmService.forwardToLLMQAForChatRelationshipCoach(relationshipCoachRequest);
    this.logger.log(`[ChatService] LLM 관계코치 응답: ${llmResponse}`);

    let reply = '';
    try {
      const parsed = extractJsonFromCodeBlock(llmResponse);
      reply = parsed?.reply || '';
    } catch (e) {
      this.logger.error('LLM 응답 파싱 실패:', e);
      reply = '';
    }

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
      reply,
    };
  }


  /**
   * 관계코치용 memory_schema 조회 (예시)
   */
  async getMemorySchema(channelId: string, userId: string, assistantId: string): Promise<Record<string, any>> {
    // 실제 서비스 상황에 맞게 필요한 정보만 포함
    // 예: 채널명, 생성일, 유저/assistant 닉네임 등
    const channel = await this.channelService.findById(channelId);
    const user = await this.userService.findById(userId);
    const assistant = await this.userService.findById(assistantId);

    return {
    };
  }

  /**
   * 관계코치용 profile 조회 (user + partner 정보 포함)
   */
  async getProfileWithPartner(userId: string, channelId: string): Promise<Record<string, any>> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('존재하지 않는 사용자입니다.');
    }
    const userPersonaSummary = await this.getPersonaSummary(userId);

    const partner = await this.getPartnerUser(channelId, userId);
    const partnerPersonaSummary = partner ? await this.getPersonaSummary(partner.id) : '';
    const userTraitQnA = await this.analyzeTraitsForUser(userId);
    const partnerTraitQnA = partner ? await this.analyzeTraitsForUser(partner.id) : {};

    return {
      me: {
        이름: user.name,
        성별: user.gender,
        생년월일: user.birthDate,
        특징: userPersonaSummary,
        trait_qna: userTraitQnA,
      },
      partner: partner
        ? {
            이름: partner.name,
            성별: partner.gender,
            생년월일: partner.birthDate,
            특징: partnerPersonaSummary,
            trait_qna: partnerTraitQnA,
          }
        : undefined,
    };
  }

  // 기존 analyzePartnerTraitsForPrompt를 아래처럼 재활용
  async analyzeTraitsForUser(userId: string) {
    const answered = await this.basicQnAService.getAnsweredQAPairs(userId);
    const categories = await this.prisma.basicQuestionCategory.findMany();
    const categoryIdToName = Object.fromEntries(categories.map(cat => [cat.id, cat.name]));
    const map: Record<string, { question: string; answer: string }[]> = {};
    for (const qa of answered) {
      const categoryName = categoryIdToName[qa.categoryId] || qa.categoryId;
      if (!map[categoryName]) map[categoryName] = [];
      map[categoryName].push({ question: qa.question, answer: qa.answer });
    }
    return map;
  }

}

function extractJsonFromCodeBlock(text: string): any | null {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch {
      const braceMatch = match[1].match(/{[\s\S]*}/);
      if (braceMatch) {
        try {
          return JSON.parse(braceMatch[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }
  const braceMatch = text.match(/{[\s\S]*}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
}
