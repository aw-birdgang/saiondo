import {Injectable} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {CreatePersonaProfileDto} from './dto/create-persona-profile.dto';
import {PersonaProfile, ProfileSource} from '@prisma/client';
import {LlmService} from '@modules/llm/llm.service';
import {UpdatePersonaProfileDto} from './dto/update-persona-profile.dto';

@Injectable()
export class PersonaProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  /**
   * 모든 페르소나 프로필을 조회 (카테고리 정보 포함)
   */
  async findAll() {
    return this.prisma.personaProfile.findMany({
      include: { categoryCode: true }, // category 정보도 함께 반환
    });
  }

  /**
   * 페르소나 프로필 생성 (categoryCodeId 유효성 검증 포함)
   */
  async create(data: CreatePersonaProfileDto) {
    const category = await this.prisma.categoryCode.findUnique({
      where: { id: data.categoryCodeId },
    });
    if (!category) throw new Error('Invalid categoryCodeId');

    return this.prisma.personaProfile.create({
      data: {
        ...data,
        source: data.source,
      },
    });
  }

  /**
   * LLM 분석 결과로부터 페르소나 프로필 저장 (isStatic: false)
   */
  async saveProfileFromAnalysis(
    userId: string,
    categoryCodeId: string,
    content: string,
    source: ProfileSource,
    confidenceScore: number,
  ) {
    return this.prisma.personaProfile.create({
      data: {
        userId,
        categoryCodeId,
        content,
        isStatic: false,
        source,
        confidenceScore,
      },
    });
  }

  /**
   * 해당 유저의 최근 채팅 데이터 30개 조회 (최신순)
   */
  async getRecentChatData(userId: string) {
    return this.prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  /**
   * 최근 채팅 데이터를 LLM에 분석 요청 후, 페르소나 프로필로 저장
   */
  async analyzeAndSavePersona(userId: string) {
    const chatData = await this.getRecentChatData(userId);
    const analysis = await this.llmService.analyzePersona(chatData);
    return this.prisma.personaProfile.create({
      data: {
        userId,
        categoryCodeId: analysis.categoryCodeId,
        content: analysis.content,
        confidenceScore: analysis.confidenceScore,
        source: 'AI_ANALYSIS',
      },
    });
  }

  /**
   * 특정 유저의 모든 페르소나 프로필 조회 (카테고리 정보 포함)
   */
  async findByUserId(userId: string) {
    return this.prisma.personaProfile.findMany({
      where: { userId },
      include: { categoryCode: true }, // 필요시 카테고리 정보도 함께 반환
    });
  }

  /**
   * 특정 유저/카테고리의 페르소나 프로필 수정 (존재하지 않으면 에러)
   */
  async update(userId: string, categoryCodeId: string, data: UpdatePersonaProfileDto) {
    const existing = await this.prisma.personaProfile.findFirst({
      where: { userId, categoryCodeId },
    });
    if (!existing) throw new Error('PersonaProfile not found');

    return this.prisma.personaProfile.updateMany({
      where: { userId, categoryCodeId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * 특정 유저/카테고리의 페르소나 프로필 삭제
   */
  async delete(userId: string, categoryCodeId: string) {
    return this.prisma.personaProfile.deleteMany({
      where: { userId, categoryCodeId },
    });
  }

  /**
   * 특정 유저의 모든 페르소나 프로필 조회 (카테고리 정보 미포함)
   */
  async getPersonaByUserId(userId: string): Promise<PersonaProfile[]> {
    return this.prisma.personaProfile.findMany({
      where: { userId },
    });
  }

  /**
   * 페르소나 프로필 직접 생성 (필드 직접 지정)
   */
  async createPersonaProfile(data: {
    userId: string;
    categoryCodeId: string;
    content: string;
    isStatic: boolean;
    source: ProfileSource;
    confidenceScore: number;
  }) {
    return this.prisma.personaProfile.create({
      data: {
        userId: data.userId,
        categoryCodeId: data.categoryCodeId,
        content: data.content,
        isStatic: data.isStatic,
        source: data.source,
        confidenceScore: data.confidenceScore,
      },
    });
  }
}
