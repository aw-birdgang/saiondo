import { Injectable } from '@nestjs/common';
import {PrismaService} from "@common/prisma/prisma.service";

@Injectable()
export class SuggestedFieldsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSuggestedField(data) {
    return this.prisma.suggestedField.create({ data });
  }

  async approveSuggestedField(id: string) {
    // 승인 처리 및 PersonaProfile 반영
    const suggested = await this.prisma.suggestedField.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
    // PersonaProfile에 반영
    await this.prisma.personaProfile.upsert({
      where: {
        userId_categoryCodeId: {
          userId: suggested.userId,
          categoryCodeId: suggested.categoryCodeId,
        },
      },
      update: {
        content: suggested.content,
        source: suggested.source,
        confidenceScore: suggested.confidenceScore,
      },
      create: {
        userId: suggested.userId,
        categoryCodeId: suggested.categoryCodeId,
        content: suggested.content,
        source: suggested.source,
        confidenceScore: suggested.confidenceScore,
      },
    });
    return suggested;
  }

  async rejectSuggestedField(id: string) {
    return this.prisma.suggestedField.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async getPendingSuggestedFields(userId: string) {
    return this.prisma.suggestedField.findMany({
      where: { userId, status: 'PENDING' },
    });
  }
}
