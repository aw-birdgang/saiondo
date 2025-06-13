import {Controller, Post, Body, Get, Query, Param} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatWithFeedbackDto } from './dto/chat-with-feedback.dto';
import {ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery} from '@nestjs/swagger';
import {CreateChatHistoryDto} from "@modules/chat/dto/create-chat-history.dto";

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post()
  @ApiOperation({
    summary: '채팅 입력 → chat-histories 저장 → LLM 피드백 → chat-histories에 피드백 저장',
  })
  @ApiBody({ type: ChatWithFeedbackDto })
  @ApiResponse({ status: 200, description: '채팅 및 피드백 처리 결과' })
  async chatWithFeedback(@Body() dto: ChatWithFeedbackDto) {
    return this.service.chatWithFeedback(dto);
  }

  @Post('with-histories')
  @ApiOperation({ summary: '채팅 메시지 생성(Room 기반)' })
  @ApiBody({ type: CreateChatHistoryDto })
  @ApiResponse({ status: 201, description: '생성된 채팅 기록 반환' })
  async create(@Body() dto: CreateChatHistoryDto) {
    return this.service.create(dto);
  }

  @Get(':assistantId/histories')
  @ApiOperation({ summary: 'Assistant 별 채팅 목록 조회' })
  @ApiQuery({
    name: 'assistantId',
    required: true,
    description: 'Assistant ID',
  })
  @ApiResponse({ status: 200, description: '채팅 기록 목록 반환' })
  async findChatsByChannelWithAssistantId(
      @Param('assistantId') assistantId: string,
  ) {
    return this.service.findChatsByChannelWithAssistantId(assistantId);
  }

}
