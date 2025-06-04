import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PointType } from '@prisma/client';
import {PrismaService} from "@common/prisma/prisma.service";
import { getErc20Contract } from '@common/utils/ethers.util';
import { ethers } from 'ethers';

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

  // 포인트 → ERC20 토큰 전환
  async convertPointToToken(userId: string, pointAmount: number) {
    // 1. 유저 포인트 차감
    await this.usePoint(userId, pointAmount, PointType.ADMIN_ADJUST, '포인트→토큰 전환');
    // 2. 유저 지갑 주소 조회 (user 테이블에 walletAddress 필드 필요)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });
    if (!user?.wallet?.address) throw new BadRequestException('지갑 주소 없음');
    // 3. ERC20 토큰 전송
    const contract = getErc20Contract();
    const decimals = Number(process.env.ERC20_TOKEN_DECIMALS || 18);
    const tx = await contract.transfer(user.wallet.address, ethers.parseUnits(pointAmount.toString(), decimals));
    return { txHash: tx.hash };
  }

  // ERC20 토큰 → 포인트 전환 (예: 입금 감지 후 호출)
  async convertTokenToPoint(userId: string, tokenAmount: number) {
    // 1. 포인트 적립
    await this.earnPoint(userId, tokenAmount, PointType.ADMIN_ADJUST, '토큰→포인트 전환');
    return { success: true };
  }
}
