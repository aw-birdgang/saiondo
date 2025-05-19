import {Injectable} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {CreatePersonaProfileDto} from './dto/create-persona-profile.dto';
import {ProfileSource, PersonaProfile} from '@prisma/client';
import {LlmService} from "@modules/llm/llm.service";
import { UpdatePersonaProfileDto } from './dto/update-persona-profile.dto';

@Injectable()
export class PersonaProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  async findAll() {
    return this.prisma.personaProfile.findMany({
      include: { categoryCode: true }, // category 정보도 함께 반환
    });
  }

  async create(data: CreatePersonaProfileDto) {
    // categoryCodeId가 실제 존재하는지 검증(선택)
    const category = await this.prisma.categoryCode.findUnique({
      where: { id: data.categoryCodeId },
    });
    if (!category) throw new Error('Invalid categoryCodeId');

    return this.prisma.personaProfile.create({
      data: {
        ...data,
        source: data.source as ProfileSource,
      },
    });
  }

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

  async getRecentChatData(userId: string) {
    // ChatHistory에서 최근 N개 메시지 조회
    return this.prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async analyzeAndSavePersona(userId: string) {
    const chatData = await this.getRecentChatData(userId);
    const analysis = await this.llmService.analyzePersona(chatData);

    // 예시: analysis = { categoryCodeId, content, confidenceScore }
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

  async findByUserId(userId: string) {
    return this.prisma.personaProfile.findMany({
      where: { userId },
      include: { categoryCode: true }, // 필요시 카테고리 정보도 함께 반환
    });
  }

  // [신규] userId+categoryCodeId로 수정
  async update(
    userId: string,
    categoryCodeId: string,
    data: UpdatePersonaProfileDto
  ) {
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

  // [신규] userId+categoryCodeId로 삭제
  async delete(userId: string, categoryCodeId: string) {
    return this.prisma.personaProfile.deleteMany({
      where: { userId, categoryCodeId },
    });
  }

  async getPersonaByUserId(userId: string): Promise<PersonaProfile[]> {
    return this.prisma.personaProfile.findMany({
      where: { userId },
    });
  }

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
