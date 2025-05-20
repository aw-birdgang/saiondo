import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateCategoryCodeDto } from './dto/create-category-code.dto';
import { UpdateCategoryCodeDto } from './dto/update-category-code.dto';

@Injectable()
export class CategoryCodeService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCategoryCodeDto) {
    return this.prisma.categoryCode.create({ data });
  }

  findAll() {
    return this.prisma.categoryCode.findMany();
  }

  findOne(id: string) {
    return this.prisma.categoryCode.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateCategoryCodeDto) {
    return this.prisma.categoryCode.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.categoryCode.delete({ where: { id } });
  }
}
