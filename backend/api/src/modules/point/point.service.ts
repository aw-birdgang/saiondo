import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PointType } from '@prisma/client';
import {PrismaService} from "@common/prisma/prisma.service";

@Injectable()
export class PointService {
  constructor(private readonly prisma: PrismaService) {}

  // 내부 공통 로직
  private async changePoint(
    userId: string,
    amount: number,
    type: PointType,
    description?: string
  ) {
    if (amount === 0) throw new BadRequestException('amount must not be zero');
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      if (amount < 0 && user.point + amount < 0) throw new BadRequestException('Not enough points');

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { point: { increment: amount } },
      });

      await tx.pointHistory.create({
        data: { userId, amount, type, description },
      });

      return updatedUser;
    });
  }

  // 포인트 획득 (미션, 프로필 등)
  async earnPoint(userId: string, amount: number, type: PointType, description?: string) {
    if (amount <= 0) throw new BadRequestException('amount must be positive');
    const allowed = [PointType.MISSION_REWARD, PointType.PROFILE_UPDATE, PointType.ADMIN_ADJUST] as const;
    if (!(allowed as readonly PointType[]).includes(type)) {
      throw new BadRequestException('Invalid point type for earning');
    }
    return this.changePoint(userId, amount, type, description);
  }

  // 포인트 사용 (AI 대화 등)
  async usePoint(userId: string, amount: number, type: PointType, description?: string) {
    if (amount <= 0) throw new BadRequestException('amount must be positive');
    const allowed = [PointType.CHAT_USE, PointType.ADMIN_ADJUST] as const;
    if (!(allowed as readonly PointType[]).includes(type)) {
      throw new BadRequestException('Invalid point type for usage');
    }
    return this.changePoint(userId, -amount, type, description);
  }

  // 관리자 조정 (플러스/마이너스 모두 허용)
  async adjustPoint(userId: string, amount: number, description?: string) {
    return this.changePoint(userId, amount, PointType.ADMIN_ADJUST, description);
  }

  // 포인트 이력 조회
  async getPointHistory(userId: string) {
    return this.prisma.pointHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
