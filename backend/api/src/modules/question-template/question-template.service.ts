// src/modules/question-template/question-template.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateQuestionTemplateDto } from './dto/create-question-template.dto';
import { QuestionType } from '@prisma/client';

@Injectable()
export class QuestionTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateQuestionTemplateDto) {
    return this.prisma.questionTemplate.create({
      data: {
        ...data,
        type: data.type as QuestionType,
      },
    });
  }

  findAll() {
    return this.prisma.questionTemplate.findMany({
      include: { categoryCode: true },
    });
  }
}
