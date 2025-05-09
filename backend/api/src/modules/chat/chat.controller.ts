import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatWithFeedbackDto } from './dto/chat-with-feedback.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post()
  @ApiOperation({ summary: '채팅 입력 → chat-histories 저장 → LLM 피드백 → chat-histories에 피드백 저장' })
  async chatWithFeedback(@Body() dto: ChatWithFeedbackDto) {
    return this.service.chatWithFeedback(dto);
  }
}
