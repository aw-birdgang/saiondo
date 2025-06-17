import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { BuyPointDto } from './dto/buy-point.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriptionHistoryDto } from './dto/subscription-history.dto';

@Injectable()
export class PaymentSubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  // 포인트 상품 목록
  async getPointProducts() {
    return this.prisma.pointProduct.findMany({ where: { isActive: true } });
  }

  // 포인트 상품 구매
  async buyPoint(userId: string, dto: BuyPointDto) {
    const product = await this.prisma.pointProduct.findUnique({ where: { id: dto.productId } });
    if (!product || !product.isActive) throw new NotFoundException('상품 없음');
    // 실제 결제 연동은 생략(성공 가정)
    await this.prisma.user.update({
      where: { id: userId },
      data: { point: { increment: product.pointAmount } },
    });
    await this.prisma.pointPurchaseHistory.create({
      data: {
        userId,
        productId: product.id,
        amount: product.pointAmount,
        price: product.price,
      },
    });
    return { success: true, pointAdded: product.pointAmount };
  }

  // 구독 플랜 목록
  async getSubscriptionPlans() {
    // 하드코딩 예시
    return [
      { plan: 'MONTHLY', price: 9900, periodDays: 30 },
      { plan: 'YEARLY', price: 99000, periodDays: 365 },
    ];
  }

  // 구독 결제 및 활성화
  async subscribe(userId: string, dto: SubscribeDto) {
    const plans = await this.getSubscriptionPlans();
    const selected = plans.find(p => p.plan === dto.plan);
    if (!selected) throw new NotFoundException('플랜 없음');
    // 실제 결제 연동은 생략(성공 가정)
    const now = new Date();
    const expiredAt = new Date(now.getTime() + selected.periodDays * 24 * 60 * 60 * 1000);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isSubscribed: true,
        subscriptionUntil: expiredAt,
      },
    });
    await this.prisma.subscriptionHistory.create({
      data: {
        userId,
        plan: selected.plan,
        startedAt: now,
        expiredAt,
      },
    });
    return { success: true, expiredAt };
  }

  async getAllSubscriptionHistories(): Promise<SubscriptionHistoryDto[]> {
    const histories = await this.prisma.subscriptionHistory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    // DTO 변환 (필요시)
    return histories.map(h => ({
      id: h.id,
      userId: h.userId,
      plan: h.plan,
      startedAt: h.startedAt,
      expiredAt: h.expiredAt,
      createdAt: h.createdAt,
    }));
  }

  async getSubscriptionHistoriesByUser(userId: string): Promise<SubscriptionHistoryDto[]> {
    const histories = await this.prisma.subscriptionHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return histories.map(h => ({
      id: h.id,
      userId: h.userId,
      plan: h.plan,
      startedAt: h.startedAt,
      expiredAt: h.expiredAt,
      createdAt: h.createdAt,
    }));
  }
}
