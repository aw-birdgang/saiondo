import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreatePersonaProfileDto } from './dto/create-persona-profile.dto';
import { ProfileSource } from '@prisma/client';

@Injectable()
export class PersonaProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.personaProfile.findMany();
  }

  async create(data: CreatePersonaProfileDto) {
    return this.prisma.personaProfile.create({
      data: {
        ...data,
        source: data.source as ProfileSource,
      },
    });
  }
}
