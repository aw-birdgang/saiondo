import {Injectable, BadRequestException} from '@nestjs/common';
import {PrismaService} from '../../common/prisma/prisma.service';
import {ChatWithFeedbackDto} from './dto/chat-with-feedback.dto';
import {MessageSender} from '@prisma/client';
import {LlmService} from "@modules/llm/llm.service";

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  async chatWithFeedback(dto: ChatWithFeedbackDto) {
    // 1. 사용자의 메시지 저장
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }

    const userChat = await this.prisma.chatHistory.create({
      data: {
        userId: dto.userId,
        roomId: dto.roomId,
        message: dto.message,
        sender: MessageSender.USER,
      },
    });

    // 2. LLM 피드백 생성 (LlmService 활용)
    const llmResponse = await this.llmService.getFeedback(dto.message, dto.roomId);

    // 3. LLM 피드백 메시지 저장
    const aiChat = await this.prisma.chatHistory.create({
      data: {
        userId: dto.userId, // 또는 시스템/AI userId
        roomId: dto.roomId,
        message: llmResponse,
        sender: MessageSender.AI,
      },
    });

    // 4. 결과 반환
    return {
      userChat,
      aiChat,
    };
  }
}
