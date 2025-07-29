import { TokenTransfer as PrismaTokenTransfer } from '@prisma/client';
import { TokenTransfer } from '../../../../domain/token-transfer';
import { TokenTransferEntity } from '../entities/token-transfer.mapper';

export class TokenTransferMapper {
  static fromPrisma(prisma: PrismaTokenTransfer): TokenTransfer {
    return {
      id: prisma.id,
      userId: prisma.userId,
      toAddress: prisma.toAddress,
      amount: prisma.amount,
      txHash: prisma.txHash,
      status: prisma.status,
      createdAt: prisma.createdAt,
    };
  }

  static toEntity(domain: TokenTransfer): TokenTransferEntity {
    return { ...domain };
  }

  static toDomain(entity: TokenTransferEntity): TokenTransfer {
    return { ...entity };
  }
}
