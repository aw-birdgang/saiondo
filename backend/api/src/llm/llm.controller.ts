import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { LlmService } from './llm.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('LLM')
@Controller('llm')
export class LlmController {
    constructor(private readonly llmService: LlmService) {}

    @Post('chat')
    @ApiOperation({ summary: 'LLM 프롬프트 전송' })
    @ApiResponse({ status: 200, description: 'LLM 응답 성공', type: ChatResponseDto })
    @ApiResponse({ status: 500, description: 'LLM 응답 실패' })
    async chat(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
        try {
            const result = await this.llmService.forwardToLLM(body.prompt, body.model);
            return { response: result };
        } catch (error) {
            throw new HttpException('LLM 호출 실패', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
