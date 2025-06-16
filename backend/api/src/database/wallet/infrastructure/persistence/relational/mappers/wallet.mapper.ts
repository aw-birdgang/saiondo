import { Wallet } from '../../../../domain/wallet';
import { WalletEntity } from '../entities/wallet.entity';
import { Wallet as PrismaWallet, User } from '@prisma/client';

type PrismaWalletWithRelations = PrismaWallet & {
  user?: User | null;
};

export class WalletMapper {
  static fromPrisma(prisma: PrismaWalletWithRelations): Wallet {
    const wallet = new Wallet();
    wallet.id = prisma.id;
    wallet.address = prisma.address;
    wallet.mnemonic = prisma.mnemonic;
    wallet.privateKey = prisma.privateKey;
    wallet.tokenBalance = prisma.tokenBalance;
    wallet.derivationIndex = prisma.derivationIndex;
    wallet.createdAt = prisma.createdAt;
    wallet.updatedAt = prisma.updatedAt;
    wallet.user = prisma.user ?? undefined;
    return wallet;
  }

  static toDomain(entity: WalletEntity): Wallet {
    const wallet = new Wallet();
    wallet.id = entity.id;
    wallet.address = entity.address;
    wallet.mnemonic = entity.mnemonic;
    wallet.privateKey = entity.privateKey;
    wallet.tokenBalance = entity.tokenBalance;
    wallet.derivationIndex = entity.derivationIndex;
    wallet.createdAt = entity.createdAt;
    wallet.updatedAt = entity.updatedAt;
    wallet.user = entity.user;
    return wallet;
  }

  static toEntity(domain: Wallet): WalletEntity {
    return {
      id: domain.id,
      address: domain.address,
      mnemonic: domain.mnemonic,
      privateKey: domain.privateKey,
      tokenBalance: domain.tokenBalance,
      derivationIndex: domain.derivationIndex,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      user: domain.user,
    } as WalletEntity;
  }
} 