import {Injectable} from '@nestjs/common';
import {NullableType} from '../../../../../../common/utils/types/nullable.type';
import {Wallet} from '../../../../domain/wallet';
import {WalletMapper} from '../mappers/wallet.mapper';
import {PrismaService} from '@common/prisma/prisma.service';
import {WalletRepository} from '../../wallet.repository';
import {createWinstonLogger} from "@common/logger/winston.logger";

@Injectable()
export class RelationalWalletRepository extends WalletRepository {
  private readonly logger = createWinstonLogger(RelationalWalletRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Wallet): Promise<Wallet> {
    this.logger.log(`create>> data ::${JSON.stringify(data)}`);
    const created = await this.prisma.wallet.create({
      data: {
        address: data.address,
        mnemonic: data.mnemonic,
        privateKey: data.privateKey,
        tokenBalance: data.tokenBalance,
        derivationIndex: data.derivationIndex,
        user: data.user ? { connect: { id: data.user.id } } : undefined,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
    return WalletMapper.fromPrisma(created);
  }

  async findById(id: string): Promise<NullableType<Wallet>> {
    const wallet = await this.prisma.wallet.findUnique({ where: { id } });
    return wallet ? WalletMapper.fromPrisma(wallet) : null;
  }

  async findAll(): Promise<Wallet[]> {
    const wallets = await this.prisma.wallet.findMany();
    return wallets.map(w => WalletMapper.fromPrisma(w));
  }

  async findAllWithUser(): Promise<Wallet[]> {
    const wallets = await this.prisma.wallet.findMany({ include: { user: true } });
    return wallets.map(w => WalletMapper.fromPrisma(w));
  }

  async findManyByUserId(userId: string): Promise<Wallet[]> {
    const wallets = await this.prisma.wallet.findMany({ where: { user: { id: userId } } });
    return wallets.map(w => WalletMapper.fromPrisma(w));
  }

  async findLastByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findFirst({
      where: { user: { id: userId } },
      orderBy: { derivationIndex: 'desc' },
    });
    return wallet ? WalletMapper.fromPrisma(wallet) : null;
  }

  async findByAddress(address: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({ where: { address } });
    return wallet ? WalletMapper.fromPrisma(wallet) : null;
  }

  async findByAddressWithUser(address: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({ where: { address }, include: { user: true } });
    return wallet ? WalletMapper.fromPrisma(wallet) : null;
  }

  async update(id: string, payload: Partial<Wallet>): Promise<Wallet> {
    const { user, ...rest } = payload;
    const data: any = { ...rest };
    if (user) {
      data.user = { connect: { id: user.id } };
    } else if (user === null) {
      data.user = { disconnect: true };
    }
    const updated = await this.prisma.wallet.update({
      where: { id },
      data,
    });
    return WalletMapper.fromPrisma(updated);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.wallet.delete({ where: { id } });
  }

  async findWithRelations(id: string, relations: any = {}): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
      include: relations,
    });
    return wallet ? WalletMapper.fromPrisma(wallet) : null;
  }
}
