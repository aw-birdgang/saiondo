import {Body, Controller, forwardRef, HttpException, HttpStatus, Inject, Post,} from '@nestjs/common';
import {LlmService} from './llm.service';
import {ChatRequestDto, ChatResponseDto} from './dto/chat.dto';
import {ChatHistoryService} from '../chat-history/chat-history.service';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AnalyzeRequestDto, AnalyzeResponseDto} from './dto/analyze.dto';
import {AnalyzeAnswerDto} from '@modules/llm/dto/analyze-answer.dto';
import {ChatHistoryRequestDto} from "@modules/llm/dto/chat-history-request.dto";
import {ChatHistoryResponseDto} from "@modules/llm/dto/chat-history-response.dto";
import {MessageSender} from "@prisma/client";
import {RelationshipCoachRequestDto, RelationshipCoachResponseDto} from "@modules/chat/dto/chat_relationship-coach.dto";

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
  @ApiResponse({
    status: 200,
    description: 'LLM 응답 성공',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 500, description: 'LLM 응답 실패' })
  async chat(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
    try {
      if (!body.assistantId) {
        throw new HttpException('assistantId is required', HttpStatus.BAD_REQUEST);
      }
      const result = await this.llmService.forwardToLLM(body.prompt, body.model);

      // 1. 사용자 프롬프트 저장
      await this.chatHistoryService.create({
        assistantId: body.assistantId,
        channelId: body.channelId,
        userId: body.userId,
        message: body.prompt,
        sender: MessageSender.USER,
        createdAt: new Date(),
      });

      // 2. LLM 응답 저장
      await this.chatHistoryService.create({
        assistantId: body.assistantId,
        channelId: body.channelId,
        userId: body.userId,
        message: result,
        sender: MessageSender.AI,
        createdAt: new Date(),
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

  @Post('chat-history')
  @ApiOperation({ summary: 'LLM 대화 히스토리 기반 응답 생성' })
  @ApiBody({ type: ChatHistoryRequestDto })
  @ApiResponse({
    status: 200,
    description: 'LLM 응답 성공',
    type: ChatHistoryResponseDto,
    example: {
      response: '상담을 위해 최근 다툰 구체적인 예시를 말씀해주실 수 있나요?'
    }
  })
  @ApiResponse({ status: 500, description: 'LLM 응답 실패' })
  async chatHistory(
    @Body() body: ChatHistoryRequestDto
  ): Promise<ChatHistoryResponseDto> {
    const { messages, model } = body;
    const response = await this.llmService.forwardHistoryToLLM({ messages, model });
    return { response };
  }

  @Post('chat-relationship-coach')
  @ApiOperation({ summary: '관계 코치 LLM 상담' })
  @ApiBody({ type: RelationshipCoachRequestDto })
  @ApiResponse({ status: 200, type: RelationshipCoachResponseDto })
  async chatRelationshipCoach(
    @Body() body: RelationshipCoachRequestDto
  ): Promise<RelationshipCoachResponseDto> {
    const response = await this.llmService.forwardToLLMForChatRelationshipCoach(body);
    return { response };
  }
}
