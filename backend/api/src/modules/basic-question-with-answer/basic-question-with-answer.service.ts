import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {CreateBasicQuestionDto, UpdateBasicQuestionDto} from './dto/create-basic-question.dto';
import {BasicQuestionResponseDto} from './dto/basic-question-response.dto';
import {CreateBasicAnswerDto} from './dto/create-basic-answer.dto';
import {BasicAnswerResponseDto, BasicAnswerWithQuestionResponseDto,} from './dto/basic-answer-response.dto';
import {BasicQuestionWithAnswerDto} from './dto/basic-question-with-answer.dto';
import { BasicQuestionCategoryResponseDto } from './dto/basic-question-category-response.dto';

@Injectable()
export class BasicQuestionWithAnswerService {
  constructor(private readonly prisma: PrismaService) {}

  // ===== 답변 관련 =====

  async createOrUpdateAnswer(dto: CreateBasicAnswerDto): Promise<BasicAnswerResponseDto> {
    // 질문의 선택지(options) 중 하나인지 검증
    const question = await this.prisma.basicQuestion.findUnique({ where: { id: dto.questionId } });
    if (!question) throw new NotFoundException('질문을 찾을 수 없습니다.');
    if (!question.options.includes(dto.answer)) {
      throw new BadRequestException('유효하지 않은 선택지입니다.');
    }

    // 이미 답변이 있으면 update, 없으면 create
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

  async getAnswersByUser(userId: string): Promise<BasicAnswerWithQuestionResponseDto[]> {
    const answers = await this.prisma.basicAnswer.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { createdAt: 'asc' },
    });
    return answers.map(BasicAnswerWithQuestionResponseDto.fromEntity);
  }

  async getAnswerByUserAndQuestion(userId: string, questionId: string): Promise<BasicAnswerResponseDto | null> {
    const answer = await this.prisma.basicAnswer.findFirst({
      where: { userId, questionId },
    });
    return answer ? BasicAnswerResponseDto.fromEntity(answer) : null;
  }

  async getAllAnswers(): Promise<BasicAnswerWithQuestionResponseDto[]> {
    const answers = await this.prisma.basicAnswer.findMany({
      include: { question: true },
      orderBy: { createdAt: 'asc' },
    });
    return answers.map(BasicAnswerWithQuestionResponseDto.fromEntity);
  }

  async deleteAnswer(answerId: string): Promise<BasicAnswerResponseDto> {
    const existing = await this.prisma.basicAnswer.findUnique({ where: { id: answerId } });
    if (!existing) throw new NotFoundException('답변을 찾을 수 없습니다.');
    const deleted = await this.prisma.basicAnswer.delete({ where: { id: answerId } });
    return BasicAnswerResponseDto.fromEntity(deleted);
  }

  // ===== 질문 관련 =====

  async getAllQuestions(): Promise<BasicQuestionResponseDto[]> {
    const questions = await this.prisma.basicQuestion.findMany();
    return questions.map(BasicQuestionResponseDto.fromEntity);
  }

  async getQuestionById(id: string): Promise<BasicQuestionResponseDto> {
    const question = await this.prisma.basicQuestion.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('질문을 찾을 수 없습니다.');
    return BasicQuestionResponseDto.fromEntity(question);
  }

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

  async deleteQuestion(id: string): Promise<BasicQuestionResponseDto> {
    await this.getQuestionById(id); // 존재 확인
    const entity = await this.prisma.basicQuestion.delete({ where: { id } });
    return BasicQuestionResponseDto.fromEntity(entity);
  }

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

  async getCategories(): Promise<BasicQuestionCategoryResponseDto[]> {
    const categories = await this.prisma.basicQuestionCategory.findMany({
      orderBy: { code: 'asc' },
    });
    return categories.map(BasicQuestionCategoryResponseDto.fromEntity);
  }

  async getQuestionsByCategory(categoryId: string): Promise<BasicQuestionResponseDto[]> {
    const questions = await this.prisma.basicQuestion.findMany({
      where: { categoryId },
      orderBy: { createdAt: 'asc' },
    });
    return questions.map(BasicQuestionResponseDto.fromEntity);
  }

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

    return questions.map(q =>
      BasicQuestionWithAnswerDto.fromEntity(q, q.answers[0] ?? null),
    );
  }

  async getAnsweredQuestionsWithAnswers(userId: string): Promise<BasicQuestionWithAnswerDto[]> {
    // 답변이 있는 항목만 join해서 가져옴
    const answers = await this.prisma.basicAnswer.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { createdAt: 'asc' },
    });

    // answer와 question이 모두 있는 DTO로 변환
    return answers.map(ans =>
      BasicQuestionWithAnswerDto.fromEntity(ans.question, ans)
    );
  }

  /**
   * 답변이 있는 질문+답변만 반환 (AI/챗봇 프롬프트용)
   */
  async getAnsweredQAPairs(userId: string): Promise<{ question: string; answer: string; categoryId: string }[]> {
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
}
