import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { PointRepository } from '../../point.repository';
import { Point } from '../../../../domain/point';
import { PointMapper } from '../mappers/point.mapper';
import { PointType } from '@prisma/client';

@Injectable()
export class RelationalPointRepository extends PointRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Point | null> {
    const prismaPoint = await this.prisma.pointHistory.findUnique({ where: { id } });

    if (!prismaPoint) return null;
    const entity = PointMapper.fromPrisma(prismaPoint);

    return PointMapper.toDomain(entity);
  }

  async findAll(): Promise<Point[]> {
    const prismaPoints = await this.prisma.pointHistory.findMany();

    return prismaPoints.map(pc => PointMapper.toDomain(PointMapper.fromPrisma(pc)));
  }

  async save(point: Point): Promise<Point> {
    const entity = PointMapper.toEntity(point);
    const prismaPoint = await this.prisma.pointHistory.upsert({
      where: { id: entity.id },
      update: {
        userId: entity.userId,
        amount: entity.amount,
        type: entity.type,
        description: entity.description,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        amount: entity.amount,
        type: entity.type,
        description: entity.description,
        createdAt: entity.createdAt,
      },
    });

    return PointMapper.toDomain(PointMapper.fromPrisma(prismaPoint));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pointHistory.delete({ where: { id } });
  }

  // 포인트 이력 생성
  async createHistory(userId: string, amount: number, type: PointType, description?: string) {
    return this.prisma.pointHistory.create({
      data: { userId, amount, type, description },
    });
  }

  // 포인트 이력 조회
  async findHistoryByUserId(userId: string) {
    return this.prisma.pointHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
