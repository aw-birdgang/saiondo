import { PointEntity } from '../entities/point.entity';
import { PointHistory as PrismaPoint } from '@prisma/client';
import { Point } from '../../../../domain/point';

export class PointMapper {
  // Prisma → Entity
  static fromPrisma(prisma: PrismaPoint): PointEntity {
    return {
      id: prisma.id,
      userId: prisma.userId,
      amount: prisma.amount,
      type: prisma.type,
      description: prisma.description ?? undefined,
      createdAt: prisma.createdAt,
    };
  }

  // Entity → 도메인
  static toDomain(entity: PointEntity): Point {
    const point = new Point();

    point.id = entity.id;
    point.userId = entity.userId;
    point.amount = entity.amount;
    point.type = entity.type;
    point.description = entity.description;
    point.createdAt = entity.createdAt;

    return point;
  }

  // 도메인 → Entity
  static toEntity(domain: Point): PointEntity {
    return {
      id: domain.id,
      userId: domain.userId,
      amount: domain.amount,
      type: domain.type,
      description: domain.description,
      createdAt: domain.createdAt ?? new Date(),
    };
  }
}
