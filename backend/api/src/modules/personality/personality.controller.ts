import { Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {
  AnalyzeBehaviorRequestDto,
  AnalyzeBehaviorResponseDto,
  AnalyzeCommunicationRequestDto,
  AnalyzeCommunicationResponseDto,
  AnalyzeConversationRequestDto,
  AnalyzeConversationResponseDto,
  AnalyzeEmotionRequestDto,
  AnalyzeEmotionResponseDto,
  AnalyzeLoveLanguageRequestDto,
  AnalyzeLoveLanguageResponseDto,
  AnalyzeMbtiRequestDto,
  AnalyzeMbtiResponseDto,
  ChatbotDetectRequestDto,
  ChatbotDetectResponseDto,
  FeedbackRequestDto,
  FeedbackResponseDto,
} from './dto';
import { PersonalityService } from './personality.service';
import { createWinstonLogger } from '@common/logger/winston.logger';

@ApiTags('Personality')
@Controller('personality')
export class PersonalityController {
  private readonly logger = createWinstonLogger(PersonalityController.name);

  constructor(private readonly personalityService: PersonalityService) {}

  @Post('analyze-conversation')
  @ApiOperation({
    summary: '대화 기반 성향 분석',
    description: '대화 메시지 배열을 기반으로 LLM이 성향을 분석합니다.',
  })
  @ApiBody({ type: AnalyzeConversationRequestDto })
  @ApiResponse({ status: 200, type: AnalyzeConversationResponseDto })
  analyzeConversation(@Body() body: AnalyzeConversationRequestDto, @Req() request: Request) {
    this.logger.log('Raw request body:', JSON.stringify(request.body, null, 2));
    this.logger.log('Parsed body:', JSON.stringify(body, null, 2));
    this.logger.log('Content-Type:', request.headers['content-type']);

    return this.personalityService.analyzeConversation(body);
  }

  @Post('analyze-mbti')
  @ApiOperation({ summary: 'MBTI 분석', description: '설문/대화 데이터 기반 MBTI 분석' })
  @ApiBody({ type: AnalyzeMbtiRequestDto })
  @ApiResponse({ status: 200, type: AnalyzeMbtiResponseDto })
  analyzeMbti(@Body() body: AnalyzeMbtiRequestDto) {
    this.logger.log('Received analyze-mbti request:', JSON.stringify(body, null, 2));

    return this.personalityService.analyzeMbti(body);
  }

  @Post('analyze-communication')
  @ApiOperation({ summary: '소통 스타일 분석', description: '대화 데이터 기반 소통 스타일 분석' })
  @ApiBody({ type: AnalyzeCommunicationRequestDto })
  @ApiResponse({ status: 200, type: AnalyzeCommunicationResponseDto })
  analyzeCommunication(@Body() body: AnalyzeCommunicationRequestDto) {
    this.logger.log('Received analyze-communication request:', JSON.stringify(body, null, 2));

    return this.personalityService.analyzeCommunication(body);
  }

  @Post('analyze-love-language')
  @ApiOperation({
    summary: '사랑의 언어 분석',
    description: '행동/대화 데이터 기반 사랑의 언어 분석',
  })
  @ApiBody({ type: AnalyzeLoveLanguageRequestDto })
  @ApiResponse({ status: 200, type: AnalyzeLoveLanguageResponseDto })
  analyzeLoveLanguage(@Body() body: AnalyzeLoveLanguageRequestDto) {
    this.logger.log('Received analyze-love-language request:', JSON.stringify(body, null, 2));

    return this.personalityService.analyzeLoveLanguage(body);
  }

  @Post('analyze-behavior')
  @ApiOperation({ summary: '행동 패턴 분석', description: '행동 데이터 기반 패턴 분석' })
  @ApiBody({ type: AnalyzeBehaviorRequestDto })
  @ApiResponse({ status: 200, type: AnalyzeBehaviorResponseDto })
  analyzeBehavior(@Body() body: AnalyzeBehaviorRequestDto) {
    this.logger.log('Received analyze-behavior request:', JSON.stringify(body, null, 2));

    return this.personalityService.analyzeBehavior(body);
  }

  @Post('analyze-emotion')
  @ApiOperation({ summary: '감정 상태 분석', description: '대화/상담 데이터 기반 감정 상태 분석' })
  @ApiBody({ type: AnalyzeEmotionRequestDto })
  @ApiResponse({ status: 200, type: AnalyzeEmotionResponseDto })
  analyzeEmotion(@Body() body: AnalyzeEmotionRequestDto) {
    this.logger.log('Received analyze-emotion request:', JSON.stringify(body, null, 2));

    return this.personalityService.analyzeEmotion(body);
  }

  @Get('profile')
  @ApiOperation({ summary: '성향 프로필 조회', description: 'userId로 성향 프로필을 조회합니다.' })
  @ApiResponse({ status: 200, description: '성향 프로필 반환' })
  getProfile(@Query('userId') userId: string) {
    this.logger.log('Received get-profile request for userId:', userId);

    return this.personalityService.getProfile(userId);
  }

  @Put('profile')
  @ApiOperation({
    summary: '성향 프로필 수정',
    description: 'userId, categoryCodeId로 성향 프로필을 수정합니다.',
  })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 200, description: '수정된 성향 프로필 반환' })
  updateProfile(@Body() body: any) {
    this.logger.log('Received update-profile request:', JSON.stringify(body, null, 2));

    return this.personalityService.updateProfile(body);
  }

  @Get('relationship-report')
  @ApiOperation({ summary: '관계 분석 리포트', description: 'channelId로 최신 커플 리포트 조회' })
  @ApiResponse({ status: 200, description: '관계 분석 리포트 반환' })
  getRelationshipReport(@Query('channelId') channelId: string) {
    this.logger.log('Received get-relationship-report request for channelId:', channelId);

    return this.personalityService.getRelationshipReport(channelId);
  }

  @Post('chatbot-detect')
  @ApiOperation({ summary: '챗봇 기반 성향 탐지', description: '챗봇 대화 데이터 기반 성향 탐지' })
  @ApiBody({ type: ChatbotDetectRequestDto })
  @ApiResponse({ status: 200, type: ChatbotDetectResponseDto })
  chatbotDetect(@Body() body: ChatbotDetectRequestDto) {
    this.logger.log('Received chatbot-detect request:', JSON.stringify(body, null, 2));

    return this.personalityService.chatbotDetect(body);
  }

  @Post('feedback')
  @ApiOperation({ summary: '성향 기반 피드백 생성', description: '상황 데이터 기반 피드백 생성' })
  @ApiBody({ type: FeedbackRequestDto })
  @ApiResponse({ status: 200, type: FeedbackResponseDto })
  feedback(@Body() body: FeedbackRequestDto) {
    this.logger.log('Received feedback request:', JSON.stringify(body, null, 2));

    return this.personalityService.feedback(body);
  }

  @Post('test-conversation')
  @ApiOperation({ summary: '테스트용 대화 분석' })
  testConversation(@Body() body: any) {
    this.logger.log('Test request body:', JSON.stringify(body, null, 2));

    return {
      message: 'Test successful',
      receivedData: body,
    };
  }
}
