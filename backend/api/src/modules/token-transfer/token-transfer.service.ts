import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class TokenTransferService {
  constructor(private readonly prisma: PrismaService) {}

  // 전송 내역 저장
  async createTransferLog(params: {
    userId: string;
    toAddress: string;
    amount: string;
    txHash: string;
    status?: string;
  }) {
    return this.prisma.tokenTransfer.create({
      data: {
        userId: params.userId,
        toAddress: params.toAddress,
        amount: params.amount,
        txHash: params.txHash,
        status: params.status ?? 'SUCCESS',
      },
    });
  }

  // 전체 내역(유저별) 조회
  async getTransfersByUser(userId: string) {
    return this.prisma.tokenTransfer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 단일 내역 조회
  async getTransferById(id: string) {
    const transfer = await this.prisma.tokenTransfer.findUnique({ where: { id } });
    if (!transfer) throw new NotFoundException('전송 내역을 찾을 수 없습니다.');
    return transfer;
  }

  // 전체 토큰 전송 내역 조회 (관리자용)
  async getAllTransfers() {
    return this.prisma.tokenTransfer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
