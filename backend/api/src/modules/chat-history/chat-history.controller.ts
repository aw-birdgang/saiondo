import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('ChatHistory')
@Controller('chat-histories')
export class ChatHistoryController {
  constructor(private readonly service: ChatHistoryService) {}

  @Post()
  @ApiOperation({ summary: '채팅 메시지 생성(Room 기반)' })
  @ApiBody({ type: CreateChatHistoryDto })
  @ApiResponse({ status: 201, description: '생성된 채팅 기록 반환' })
  async create(@Body() dto: CreateChatHistoryDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Assistant 별 채팅 목록 조회' })
  @ApiQuery({
    name: 'assistantId',
    required: true,
    description: 'Assistant ID',
  })
  @ApiResponse({ status: 200, description: '채팅 기록 목록 반환' })
  async findByRoom(@Query('assistantId') assistantId: string) {
    return this.service.findByRoom(assistantId);
  }
}
