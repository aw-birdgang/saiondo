import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from '../../common/prisma/prisma.service';
import {ChatWithFeedbackDto} from './dto/chat-with-feedback.dto';
import {MessageSender, ChatHistory} from '@prisma/client';
import {LlmService} from "@modules/llm/llm.service";

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
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
}
