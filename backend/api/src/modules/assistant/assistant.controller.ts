import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssistantService } from '@modules/assistant/assistant.service';
import { CreateAssistantDto } from '@modules/assistant/dto/create-assistant.dto';

@ApiTags('Assistant')
@Controller('assistant')
export class AssistantController {
  constructor(private readonly service: AssistantService) {}

  @Post()
  @ApiOperation({ summary: 'Assistant 생성' })
  @ApiBody({ type: CreateAssistantDto })
  @ApiResponse({ status: 201, description: '생성된 Room 반환' })
  async create(@Body() dto: CreateAssistantDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '모든 Assistant 조회' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Assistant 단건 조회' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Assistant 삭제' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }
}
