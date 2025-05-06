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
import {AnalyzeRequestDto, AnalyzeResponseDto} from "./dto/analyze.dto";

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

    @Post('analyze')
    @ApiOperation({ summary: '성향 분석 + 궁합 + 조언 생성' })
    @ApiResponse({ status: 200, type: AnalyzeResponseDto })
    @ApiResponse({ status: 500, description: 'LLM 응답 실패' })
    async analyze(@Body() body: AnalyzeRequestDto): Promise<AnalyzeResponseDto> {
        return this.llmService.analyze(body);
    }
}
