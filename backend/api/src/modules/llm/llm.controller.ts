import {Body, Controller, forwardRef, HttpException, HttpStatus, Inject, Post,} from '@nestjs/common';
import {LlmService} from './llm.service';
import {ChatRequestDto, ChatResponseDto} from './dto/chat.dto';
import {ChatHistoryService} from '../chat-history/chat-history.service';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AnalyzeRequestDto, AnalyzeResponseDto} from "./dto/analyze.dto";
import {AnalyzeAnswerDto} from "@modules/llm/dto/analyze-answer.dto";

@ApiTags('LLM')
@Controller('llm')
export class LlmController {
    constructor(
        private readonly llmService: LlmService,
        @Inject(forwardRef(() => ChatHistoryService))
        private readonly chatHistoryService: ChatHistoryService,
    ) {}

    @Post('chat')
    @ApiOperation({ summary: 'LLM 프롬프트 전송' })
    @ApiBody({ type: ChatRequestDto })
    @ApiResponse({ status: 200, description: 'LLM 응답 성공', type: ChatResponseDto })
    @ApiResponse({ status: 500, description: 'LLM 응답 실패' })
    async chat(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
        try {
            if (!body.roomId) {
                throw new HttpException('roomId is required', HttpStatus.BAD_REQUEST);
            }
            const result = await this.llmService.forwardToLLM(body.prompt, body.model);

            // 1. 사용자 프롬프트 저장
            await this.chatHistoryService.create({
                roomId: body.roomId,
                userId: body.userId,
                message: body.prompt,
                sender: 'USER',
                isUserInitiated: true,
                timestamp: new Date(),
            });

            // 2. LLM 응답 저장
            await this.chatHistoryService.create({
                roomId: body.roomId,
                userId: body.userId,
                message: result,
                sender: 'AI',
                isUserInitiated: false,
                analyzedByLlm: true,
                timestamp: new Date(),
            });

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

    @Post('analyze-answer')
    @ApiOperation({ summary: '유저 답변 LLM 분석' })
    @ApiBody({ type: AnalyzeAnswerDto })
    @ApiResponse({ status: 200, description: 'LLM 분석 결과 반환' })
    async analyzeAnswer(@Body() dto: AnalyzeAnswerDto) {
        return this.llmService.analyzeAnswer(dto);
    }
}
