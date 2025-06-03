import {
  Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, BadRequestException,
} from '@nestjs/common';
import { BasicQuestionWithAnswerService } from './basic-question-with-answer.service';
import {CreateBasicQuestionDto, UpdateBasicQuestionDto} from './dto/create-basic-question.dto';
import {
  ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { BasicQuestionResponseDto } from './dto/basic-question-response.dto';
import { CreateBasicAnswerDto } from './dto/create-basic-answer.dto';
import {
  BasicAnswerResponseDto,
  BasicAnswerWithQuestionResponseDto,
} from './dto/basic-answer-response.dto';
import { BasicQuestionWithAnswerDto } from './dto/basic-question-with-answer.dto';
import { BasicQuestionCategoryResponseDto } from './dto/basic-question-category-response.dto';

@ApiTags('BasicQuestionWithAnswer')
@Controller('basic-question-with-answer')
export class BasicQuestionWithAnswerController {
  constructor(private readonly service: BasicQuestionWithAnswerService) {}

  // ===== 답변 관련 =====

  @ApiOperation({ summary: '답변 저장' })
  @ApiBody({ type: CreateBasicAnswerDto })
  @ApiResponse({ status: 201, description: '저장된 답변 반환', type: BasicAnswerResponseDto })
  @Post('answer')
  async createOrUpdateAnswer(@Body() dto: CreateBasicAnswerDto): Promise<BasicAnswerResponseDto> {
    if (!dto.userId || !dto.questionId || !dto.answer) {
      throw new BadRequestException('필수값 누락');
    }
    return this.service.createOrUpdateAnswer(dto);
  }

  @ApiOperation({ summary: '유저의 모든 답변(질문 포함) 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID', type: String, example: 'user-uuid' })
  @ApiResponse({
    status: 200,
    description: '유저의 답변 리스트(질문 포함)',
    type: BasicAnswerWithQuestionResponseDto,
    isArray: true,
  })
  @Get('answers/user/:userId')
  async getAnswersByUser(
    @Param('userId') userId: string,
  ): Promise<BasicAnswerWithQuestionResponseDto[]> {
    return this.service.getAnswersByUser(userId);
  }

  @ApiOperation({ summary: '유저의 특정 질문 답변 조회' })
  @ApiQuery({ name: 'userId', description: '유저 ID', type: String, example: 'user-uuid' })
  @ApiQuery({ name: 'questionId', description: '질문 ID', type: String, example: 'question-uuid' })
  @ApiResponse({ status: 200, description: '유저의 특정 질문 답변', type: BasicAnswerResponseDto })
  @Get('answer/user/:userId/question/:questionId')
  async getAnswerByUserAndQuestion(
      @Query('userId') userId: string,
      @Query('questionId') questionId: string,
  ): Promise<BasicAnswerResponseDto> {
    const entity = await this.service.getAnswerByUserAndQuestion(userId, questionId);
    if (!entity) throw new NotFoundException('답변을 찾을 수 없습니다.');
    return BasicAnswerResponseDto.fromEntity(entity);
  }

  @ApiOperation({ summary: '모든 답변 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '모든 답변 리스트(질문 포함)',
    type: BasicAnswerWithQuestionResponseDto,
    isArray: true,
  })
  @Get('answers')
  async getAllAnswers(): Promise<BasicAnswerWithQuestionResponseDto[]> {
    return this.service.getAllAnswers();
  }

  @ApiOperation({ summary: '답변 삭제' })
  @ApiParam({ name: 'answerId', description: '답변 ID', type: String, example: 'answer-uuid' })
  @ApiResponse({
    status: 200,
    description: '삭제된 답변 반환',
    type: BasicAnswerResponseDto,
  })
  @Delete('answer/:answerId')
  async deleteAnswer(@Param('answerId') answerId: string): Promise<BasicAnswerResponseDto> {
    return this.service.deleteAnswer(answerId);
  }

  // ===== 질문 관련 =====

  @ApiOperation({ summary: '모든 기본질문 조회' })
  @ApiResponse({
    status: 200,
    description: '기본질문 리스트 반환',
    type: BasicQuestionResponseDto,
    isArray: true,
  })
  @Get('questions')
  async getAllQuestions(): Promise<BasicQuestionResponseDto[]> {
    return this.service.getAllQuestions();
  }

  @ApiOperation({ summary: '기본질문 단건 조회' })
  @ApiParam({ name: 'id', description: '질문 ID', type: String, example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '기본질문 반환',
    type: BasicQuestionResponseDto,
  })
  @Get('questions/:id')
  async getQuestionById(@Param('id') id: string): Promise<BasicQuestionResponseDto> {
    const entity = await this.service.getQuestionById(id);
    if (!entity) throw new NotFoundException('질문을 찾을 수 없습니다.');
    return entity;
  }

  @ApiOperation({ summary: '기본질문 생성' })
  @ApiBody({ type: CreateBasicQuestionDto })
  @ApiResponse({
    status: 201,
    description: '생성된 기본질문 반환',
    type: BasicQuestionResponseDto,
  })
  @Post('questions')
  async createQuestion(@Body() dto: CreateBasicQuestionDto): Promise<BasicQuestionResponseDto> {
    return this.service.createQuestion(dto);
  }

  @ApiOperation({ summary: '기본질문 수정' })
  @ApiParam({ name: 'id', description: '질문 ID', type: String, example: 'uuid' })
  @ApiBody({ type: UpdateBasicQuestionDto })
  @ApiResponse({
    status: 200,
    description: '수정된 기본질문 반환',
    type: BasicQuestionResponseDto,
  })
  @Patch('questions/:id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() dto: UpdateBasicQuestionDto,
  ): Promise<BasicQuestionResponseDto> {
    return this.service.updateQuestion(id, dto);
  }

  @ApiOperation({ summary: '기본 질문 삭제' })
  @ApiParam({ name: 'id', description: '질문 ID', type: String, example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: '삭제된 기본질문 반환',
    type: BasicQuestionResponseDto,
  })
  @Delete('questions/:id')
  async deleteQuestion(@Param('id') id: string): Promise<BasicQuestionResponseDto> {
    return this.service.deleteQuestion(id);
  }

  @ApiOperation({ summary: '질문+답변(유저별) 복합 조회' })
  @ApiQuery({ name: 'userId', description: '유저 ID', type: String, example: 'user-uuid' })
  @ApiResponse({
    status: 200,
    description: '질문+답변 리스트',
    type: BasicQuestionWithAnswerDto,
    isArray: true,
  })
  @Get('questions-with-answers')
  async getQuestionsWithAnswers(
    @Query('userId') userId: string,
  ): Promise<BasicQuestionWithAnswerDto[]> {
    return this.service.getQuestionsWithAnswers(userId);
  }

  @ApiOperation({ summary: '질문 카테고리 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '카테고리 리스트 반환',
    type: BasicQuestionCategoryResponseDto,
    isArray: true,
  })
  @Get('categories')
  async getCategories(): Promise<BasicQuestionCategoryResponseDto[]> {
    return this.service.getCategories();
  }

  @ApiOperation({ summary: '카테고리별 질문 목록 조회' })
  @ApiParam({ name: 'categoryId', description: '카테고리 ID', type: String })
  @ApiResponse({
    status: 200,
    description: '카테고리별 질문 리스트 반환',
    type: BasicQuestionResponseDto,
    isArray: true,
  })
  @Get('categories/:categoryId/questions')
  async getQuestionsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<BasicQuestionResponseDto[]> {
    return this.service.getQuestionsByCategory(categoryId);
  }

  @ApiOperation({ summary: '카테고리별 질문+답변(유저별) 복합 조회' })
  @ApiParam({ name: 'categoryId', description: '카테고리 ID', type: String })
  @ApiQuery({ name: 'userId', description: '유저 ID', type: String })
  @ApiResponse({
    status: 200,
    description: '카테고리별 질문+답변 리스트',
    type: BasicQuestionWithAnswerDto,
    isArray: true,
  })
  @Get('categories/:categoryId/questions-with-answers')
  async getQuestionsWithAnswersOnCategory(
    @Param('categoryId') categoryId: string,
    @Query('userId') userId: string,
  ): Promise<BasicQuestionWithAnswerDto[]> {
    return this.service.getQuestionsWithAnswersOnCategory(userId, categoryId);
  }

  /**
   * 답변이 있는 질문+답변만 반환 (AI/챗봇 프롬프트용)
   */
  @Get('answered-qa/:userId')
  async getAnsweredQAPairs(@Param('userId') userId: string) {
    return this.service.getAnsweredQAPairs(userId);
  }
}
