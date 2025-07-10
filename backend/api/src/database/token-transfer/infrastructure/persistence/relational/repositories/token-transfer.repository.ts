import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { TokenTransferRepository } from '../../token-transfer.repository';
import { TokenTransfer } from '../../../../domain/token-transfer';
import { TokenTransferMapper } from '../mappers/token-transfer.mapper';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class RelationalTokenTransferRepository extends TokenTransferRepository {
  private readonly logger = createWinstonLogger(RelationalTokenTransferRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<TokenTransfer | null> {
    const prismaTokenTransfer = await this.prisma.tokenTransfer.findUnique({ where: { id } });
    if (!prismaTokenTransfer) return null;
    const entity = TokenTransferMapper.fromPrisma(prismaTokenTransfer);
    return TokenTransferMapper.toDomain(entity);
  }

  async findAll(): Promise<TokenTransfer[]> {
    const prismaTokenTransfers = await this.prisma.tokenTransfer.findMany();
    return prismaTokenTransfers.map(pt => TokenTransferMapper.toDomain(TokenTransferMapper.fromPrisma(pt)));
  }

  async save(tokenTransfer: TokenTransfer): Promise<TokenTransfer> {
    const entity = TokenTransferMapper.toEntity(tokenTransfer);
    const prismaTokenTransfer = await this.prisma.tokenTransfer.upsert({
      where: { id: entity.id },
      update: {
        userId: entity.userId,
        toAddress: entity.toAddress,
        amount: entity.amount,
        txHash: entity.txHash,
        status: entity.status,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        toAddress: entity.toAddress,
        amount: entity.amount,
        txHash: entity.txHash,
        status: entity.status,
        createdAt: entity.createdAt,
      },
    });
    return TokenTransferMapper.toDomain(TokenTransferMapper.fromPrisma(prismaTokenTransfer));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tokenTransfer.delete({ where: { id } });
  }

  async findByUserId(userId: string): Promise<TokenTransfer[]> {
    const prismaTokenTransfers = await this.prisma.tokenTransfer.findMany({ where: { userId } });
    return prismaTokenTransfers.map(pt => TokenTransferMapper.toDomain(TokenTransferMapper.fromPrisma(pt)));
  }

}
