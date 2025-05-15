import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../../common/prisma/prisma.service';
import {ChatWithFeedbackDto} from './dto/chat-with-feedback.dto';
import {MessageSender, ChatHistory, PersonaProfile, User} from '@prisma/client';
import {LlmService} from "@modules/llm/llm.service";
import {RoomService} from "@modules/room/room.service";
import {PersonaProfileService} from "@modules/persona-profile/persona-profile.service";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
    private readonly roomService: RoomService,
    private readonly personaProfileService: PersonaProfileService,
  ) {}

  /**
   * 사용자의 메시지를 받고, LLM 피드백까지 저장 후 결과 반환
   */
  async chatWithFeedback(dto: ChatWithFeedbackDto): Promise<{ userChat: ChatHistory; aiChat: ChatHistory }> {
    const {userId, roomId, message} = dto;
    return this.sendToLLM(message, roomId, userId, "");
  }

  /**
   * 사용자 존재 여부 검증
   */
  private async validateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({where: {id: userId}});
    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }
  }

  /**
   * 채팅 메시지 저장 (USER/AI 구분)
   */
  private async saveChatMessage(
    userId: string,
    roomId: string,
    message: string,
    sender: MessageSender,
  ): Promise<ChatHistory> {
    return this.prisma.chatHistory.create({
      data: {
        userId,
        roomId,
        message,
        sender,
      },
    });
  }

  /**
   * LLM에 메시지 전달, 피드백 저장 및 결과 반환
   */
  async sendToLLM(
    message: string,
    roomId: string,
    userId: string,
    prompt: string,
  ): Promise<{ userChat: ChatHistory; aiChat: ChatHistory }> {
    // 1. 사용자 검증
    await this.validateUser(userId);

    // 2. 사용자 메시지 저장
    const userChat = await this.saveChatMessage(userId, roomId, message, MessageSender.USER);

    // 3. LLM 피드백 생성
    const llmResponse = await this.llmService.getFeedback(prompt, roomId);

    // 4. LLM 피드백 메시지 저장
    const aiChat = await this.saveChatMessage(userId, roomId, llmResponse, MessageSender.AI);

    // 5. 결과 반환
    return {userChat, aiChat};
  }

  async processUserMessage(userId: string, roomId: string, message: string) {
    // 1. 룸 참여자 조회
    const participants = await this.roomService.getRoomParticipants(roomId);
    if (!participants || participants.length !== 2) {
      throw new Error('채팅방 참여자 정보를 찾을 수 없습니다.');
    }
    const questioner = participants.find(u => u.id === userId);
    const partner = participants.find(u => u.id !== userId);
    if (!questioner || !partner) {
      throw new Error('질문자 또는 상대방 정보를 찾을 수 없습니다.');
    }

    // 2. 상대방 특징 조회
    const partnerPersona: PersonaProfile[] = await this.personaProfileService.getPersonaByUserId(partner.id);
    let personaSummary = partnerPersona.length > 0
      ? partnerPersona.map(p => `${p.categoryCodeId}: ${p.content}`).join(', ')
      : '정보없음';

    // 3. LLM 프롬프트에 상대방 정보 포함
    const prompt = `
질문자: ${questioner.gender}
상대방: ${partner.gender}
상대방 특징: ${personaSummary}
질문: ${message}
`;

    this.logger.log(`[ChatService] LLM Prompt: ${prompt}`);

    // 4. LLM 피드백 및 DB 저장
    const { userChat, aiChat } = await this.sendToLLM(
      message,
      roomId,
      userId,
      prompt,
    );

    // 5. 결과 반환
    return {
      userId,
      roomId,
      message,
      userChat,
      aiChat,
    };
  }
}
