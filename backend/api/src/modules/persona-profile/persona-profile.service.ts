import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreatePersonaProfileDto } from './dto/create-persona-profile.dto';
import { ProfileSource } from '@prisma/client';

@Injectable()
export class PersonaProfileService {
  constructor(private readonly prisma: PrismaService) {}

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
}
