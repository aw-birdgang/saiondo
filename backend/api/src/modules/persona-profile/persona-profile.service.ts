import {Injectable} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {CreatePersonaProfileDto} from './dto/create-persona-profile.dto';
import {PersonaProfile, ProfileSource} from '@prisma/client';
import {LlmService} from '@modules/llm/llm.service';
import {UpdatePersonaProfileDto} from './dto/update-persona-profile.dto';
import { PointService } from '../point/point.service';
import { PointType } from '@prisma/client';

@Injectable()
export class PersonaProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
    private readonly pointService: PointService,
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

    await this.pointService.earnPoint(userId, 10, PointType.PROFILE_UPDATE, '프로필 업데이트 보상');

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
