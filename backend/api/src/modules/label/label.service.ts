import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateLabelCategoryDto } from '@modules/label/dto/create-label-category.dto';
import { CreateLabelDto } from '@modules/label/dto/create-label.dto';
import { CreateMessageLabelDto } from '@modules/label/dto/create-message-label.dto';

@Injectable()
export class LabelService {
  constructor(private readonly prisma: PrismaService) {}

  getCategories() {
    return this.prisma.labelCategory.findMany();
  }

  createCategory(dto: CreateLabelCategoryDto) {
    return this.prisma.labelCategory.create({ data: dto });
  }

  getLabelsByCategory(categoryId: string) {
    return this.prisma.label.findMany({ where: { categoryId } });
  }

  createLabel(dto: CreateLabelDto) {
    return this.prisma.label.create({ data: dto });
  }

  createMessageLabel(dto: CreateMessageLabelDto) {
    return this.prisma.messageLabel.create({ data: dto });
  }

  getMessageLabels(messageId: string) {
    return this.prisma.messageLabel.findMany({
      where: { messageId },
      include: { label: true },
    });
  }
}
