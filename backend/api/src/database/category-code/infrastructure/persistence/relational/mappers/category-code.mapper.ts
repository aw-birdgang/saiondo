import { CategoryCodeEntity } from '../entities/category-code.entity';
import { CategoryCode as PrismaCategoryCode } from '@prisma/client';
import { CategoryCode } from '../../../../domain/category-code';

export class CategoryCodeMapper {
  static fromPrisma(prisma: PrismaCategoryCode): CategoryCode {
    return {
      id: prisma.id,
      code: prisma.code,
      description: prisma.description ?? undefined,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };
  }

  static toEntity(domain: CategoryCode): CategoryCodeEntity {
    return {
      id: domain.id,
      code: domain.code,
      description: domain.description,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toDomain(entity: CategoryCodeEntity): CategoryCode {
    return {
      id: entity.id,
      code: entity.code,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
