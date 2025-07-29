import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateBasicQuestionDto, UpdateBasicQuestionDto } from './dto/create-basic-question.dto';
import { BasicQuestionResponseDto } from './dto/basic-question-response.dto';
import { CreateBasicAnswerDto } from './dto/create-basic-answer.dto';
import {
  BasicAnswerResponseDto,
  BasicAnswerWithQuestionResponseDto,
} from './dto/basic-answer-response.dto';
import { BasicQuestionWithAnswerDto } from './dto/basic-question-with-answer.dto';
import { BasicQuestionCategoryResponseDto } from './dto/basic-question-category-response.dto';

/**
 * BasicQuestionWithAnswerService
 * - [답변 관련] CRUD, 조회, Q&A 페어, 삭제 등
 * - [질문 관련] CRUD, 카테고리, 카테고리별 조회 등
 */
@Injectable()
export class BasicQuestionWithAnswerService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // ===== 답변 관련 메서드 =====
  // =========================

  /** 답변 생성 또는 수정 */
  async createOrUpdateAnswer(dto: CreateBasicAnswerDto): Promise<BasicAnswerResponseDto> {
    const question = await this.prisma.basicQuestion.findUnique({ where: { id: dto.questionId } });

    if (!question) throw new NotFoundException('질문을 찾을 수 없습니다.');
    if (!question.options.includes(dto.answer)) {
      throw new BadRequestException('유효하지 않은 선택지입니다.');
    }

    const existing = await this.prisma.basicAnswer.findFirst({
      where: { userId: dto.userId, questionId: dto.questionId },
    });

    if (existing) {
      const updated = await this.prisma.basicAnswer.update({
        where: { id: existing.id },
        data: { answer: dto.answer, updatedAt: new Date() },
      });

      return BasicAnswerResponseDto.fromEntity(updated);
    } else {
      const created = await this.prisma.basicAnswer.create({ data: dto });

      return BasicAnswerResponseDto.fromEntity(created);
    }
  }

  /** 유저별 답변 전체 조회 (질문 포함) */
  async getAnswersByUser(userId: string): Promise<BasicAnswerWithQuestionResponseDto[]> {
    const answers = await this.prisma.basicAnswer.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { createdAt: 'asc' },
    });

    return answers.map(BasicAnswerWithQuestionResponseDto.fromEntity);
  }

  /** 유저/질문별 답변 조회 */
  async getAnswerByUserAndQuestion(
    userId: string,
    questionId: string,
  ): Promise<BasicAnswerResponseDto | null> {
    const answer = await this.prisma.basicAnswer.findFirst({
      where: { userId, questionId },
    });

    return answer ? BasicAnswerResponseDto.fromEntity(answer) : null;
  }

  /** 전체 답변 조회 (질문 포함) */
  async getAllAnswers(): Promise<BasicAnswerWithQuestionResponseDto[]> {
    const answers = await this.prisma.basicAnswer.findMany({
      include: { question: true },
      orderBy: { createdAt: 'asc' },
    });

    return answers.map(BasicAnswerWithQuestionResponseDto.fromEntity);
  }

  /** 답변 삭제 */
  async deleteAnswer(answerId: string): Promise<BasicAnswerResponseDto> {
    const existing = await this.prisma.basicAnswer.findUnique({ where: { id: answerId } });

    if (!existing) throw new NotFoundException('답변을 찾을 수 없습니다.');
    const deleted = await this.prisma.basicAnswer.delete({ where: { id: answerId } });

    return BasicAnswerResponseDto.fromEntity(deleted);
  }

  /**
   * 답변이 있는 질문+답변만 반환 (AI/챗봇 프롬프트용)
   */
  async getAnsweredQAPairs(
    userId: string,
  ): Promise<{ question: string; answer: string; categoryId: string }[]> {
    const answers = await this.prisma.basicAnswer.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { createdAt: 'asc' },
    });

    // answer가 null/빈문자열인 경우는 제외
    return answers
      .filter(ans => ans.answer && ans.answer.trim() !== '' && ans.question)
      .map(ans => ({
        question: ans.question.question,
        answer: ans.answer,
        categoryId: ans.question.categoryId,
      }));
  }

  /** 유저별 답변이 있는 질문+답변 DTO 반환 */
  async getAnsweredQuestionsWithAnswers(userId: string): Promise<BasicQuestionWithAnswerDto[]> {
    const answers = await this.prisma.basicAnswer.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { createdAt: 'asc' },
    });

    return answers.map(ans => BasicQuestionWithAnswerDto.fromEntity(ans.question, ans));
  }

  // =========================
  // ===== 질문 관련 메서드 =====
  // =========================

  /** 전체 질문 조회 */
  async getAllQuestions(): Promise<BasicQuestionResponseDto[]> {
    const questions = await this.prisma.basicQuestion.findMany();

    return questions.map(BasicQuestionResponseDto.fromEntity);
  }

  /** 질문 ID로 조회 */
  async getQuestionById(id: string): Promise<BasicQuestionResponseDto> {
    const question = await this.prisma.basicQuestion.findUnique({ where: { id } });

    if (!question) throw new NotFoundException('질문을 찾을 수 없습니다.');

    return BasicQuestionResponseDto.fromEntity(question);
  }

  /** 질문 생성 */
  async createQuestion(dto: CreateBasicQuestionDto): Promise<BasicQuestionResponseDto> {
    const entity = await this.prisma.basicQuestion.create({
      data: {
        categoryId: dto.categoryId,
        question: dto.question,
        description: dto.description,
        options: dto.options,
      },
    });

    return BasicQuestionResponseDto.fromEntity(entity);
  }

  /** 질문 수정 */
  async updateQuestion(id: string, dto: UpdateBasicQuestionDto): Promise<BasicQuestionResponseDto> {
    await this.getQuestionById(id); // 존재 확인
    const entity = await this.prisma.basicQuestion.update({
      where: { id },
      data: {
        ...dto,
        options: dto.options,
      },
    });

    return BasicQuestionResponseDto.fromEntity(entity);
  }

  /** 질문 삭제 */
  async deleteQuestion(id: string): Promise<BasicQuestionResponseDto> {
    await this.getQuestionById(id); // 존재 확인
    const entity = await this.prisma.basicQuestion.delete({ where: { id } });

    return BasicQuestionResponseDto.fromEntity(entity);
  }

  /** 유저별 질문+답변 DTO 반환 */
  async getQuestionsWithAnswers(userId: string): Promise<BasicQuestionWithAnswerDto[]> {
    const questions = await this.prisma.basicQuestion.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        answers: {
          where: { userId },
          take: 1,
        },
      },
    });

    return questions.map(q => BasicQuestionWithAnswerDto.fromEntity(q, q.answers[0] ?? null));
  }

  /** 카테고리 전체 조회 */
  async getCategories(): Promise<BasicQuestionCategoryResponseDto[]> {
    const categories = await this.prisma.basicQuestionCategory.findMany({
      orderBy: { code: 'asc' },
    });

    return categories.map(BasicQuestionCategoryResponseDto.fromEntity);
  }

  /** 카테고리별 질문 조회 */
  async getQuestionsByCategory(categoryId: string): Promise<BasicQuestionResponseDto[]> {
    const questions = await this.prisma.basicQuestion.findMany({
      where: { categoryId },
      orderBy: { createdAt: 'asc' },
    });

    return questions.map(BasicQuestionResponseDto.fromEntity);
  }

  /** 카테고리별 유저별 질문+답변 DTO 반환 */
  async getQuestionsWithAnswersOnCategory(
    userId: string,
    categoryId: string,
  ): Promise<BasicQuestionWithAnswerDto[]> {
    const questions = await this.prisma.basicQuestion.findMany({
      where: { categoryId },
      orderBy: { createdAt: 'asc' },
      include: {
        answers: {
          where: { userId },
          take: 1,
        },
      },
    });

    return questions.map(q => BasicQuestionWithAnswerDto.fromEntity(q, q.answers[0] ?? null));
  }
}
