import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {CategoryCodeMapper} from '../mappers/category-code.mapper';
import {CategoryCodeRepository} from "../../category-code.repository";
import {CategoryCode} from "../../../../domain/category-code";

@Injectable()
export class RelationalCategoryCodeRepository extends CategoryCodeRepository {
  private readonly logger = new Logger(RelationalCategoryCodeRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<CategoryCode | null> {
    const prismaCategoryCode = await this.prisma.categoryCode.findUnique({ where: { id } });
    if (!prismaCategoryCode) return null;
    const entity = CategoryCodeMapper.fromPrisma(prismaCategoryCode);
    return CategoryCodeMapper.toDomain(entity);
  }

  async findAll(): Promise<CategoryCode[]> {
    const prismaCategoryCodes = await this.prisma.categoryCode.findMany();
    return prismaCategoryCodes.map(pc => CategoryCodeMapper.toDomain(CategoryCodeMapper.fromPrisma(pc)));
  }

  async save(categoryCode: CategoryCode): Promise<CategoryCode> {
    const entity = CategoryCodeMapper.toEntity(categoryCode);
    const prismaCategoryCode = await this.prisma.categoryCode.upsert({
      where: { id: entity.id },
      update: {
        code: entity.code,
        description: entity.description,
        updatedAt: new Date(),
      },
      create: {
        id: entity.id,
        code: entity.code,
        description: entity.description,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });
    return CategoryCodeMapper.toDomain(CategoryCodeMapper.fromPrisma(prismaCategoryCode));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.categoryCode.delete({ where: { id } });
  }
}
