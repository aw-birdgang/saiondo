import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PointType} from '@prisma/client';
import {PrismaService} from "@common/prisma/prisma.service";
import { TokenTransferService } from '../token-transfer/token-transfer.service';
import { WalletService } from '@modules/wallet/wallet.service';
import {Web3Service} from "@modules/web3/web3.service";

@Injectable()
export class PointService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly web3Service: Web3Service,
    private readonly tokenTransferService: TokenTransferService,
    private readonly walletService: WalletService,
  ) {}

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

  /**
   * 포인트를 토큰으로 변환(전송)하는 메서드
   */
  async convertPointToToken(userId: string, pointAmount: number) {
    if (pointAmount <= 0) throw new BadRequestException('포인트는 1 이상이어야 합니다.');

    // 1. 유저 조회 (지갑 주소 포함)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });
    if (!user) throw new NotFoundException('유저 없음');
    if (!user.wallet?.address) throw new BadRequestException('지갑 주소 없음');

    // 2. 포인트 충분한지 확인
    if (user.point < pointAmount) throw new BadRequestException('포인트 부족');

    // 3. 토큰 전송
    const txHash = await this.web3Service.transferToken(user.wallet.address, pointAmount);

    // 4. 포인트 차감
    await this.prisma.user.update({
      where: { id: userId },
      data: { point: { decrement: pointAmount } },
    });

    // 5. 전송 성공 시 해당 지갑 잔액 동기화
    await this.walletService.refreshWalletBalance(user.wallet.id);

    // 전송 내역 기록
    await this.tokenTransferService.createTransferLog({
      userId,
      toAddress: user.wallet.address,
      amount: pointAmount.toString(),
      txHash,
      status: 'SUCCESS',
    });

    // 6. 기록 저장 (선택)
    await this.prisma.pointHistory.create({
      data: {
        userId,
        type: 'CONVERT_TO_TOKEN',
        amount: pointAmount,
      },
    });

    return { txHash };
  }

  // ERC20 토큰 → 포인트 전환 (예: 입금 감지 후 호출)
  async convertTokenToPoint(userId: string, tokenAmount: number) {
    // 1. 포인트 적립
    await this.earnPoint(userId, tokenAmount, PointType.ADMIN_ADJUST, '토큰→포인트 전환');
    return { success: true };
  }
}
