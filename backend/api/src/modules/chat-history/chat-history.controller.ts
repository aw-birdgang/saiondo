import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('ChatHistory')
@Controller('chat-histories')
export class ChatHistoryController {
  constructor(private readonly service: ChatHistoryService) {}

  @Get()
  @ApiOperation({ summary: '모든 채팅 기록 조회' })
  @ApiResponse({ status: 200, description: '채팅 기록 목록 반환' })
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: '채팅 기록 생성' })
  @ApiBody({ type: CreateChatHistoryDto })
  @ApiResponse({ status: 201, description: '생성된 채팅 기록 반환' })
  async create(@Body() body: CreateChatHistoryDto) {
    return this.service.create(body);
  }
}
