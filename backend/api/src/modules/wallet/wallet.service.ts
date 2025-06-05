import {BadRequestException, ForbiddenException, Injectable, NotFoundException,} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {createWalletFromEnvMnemonic, decrypt, encrypt, isValidEthAddress,} from '@common/utils/wallet.util';
import {ethers} from 'ethers';
import {Web3Service} from '@modules/web3/web3.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly web3Service: Web3Service,
  ) {}

  async getAllWallets() {
    return this.prisma.wallet.findMany({ include: { user: true } });
  }

  async getWalletsByUser(userId: string) {
    const wallets = await this.prisma.wallet.findMany({
      where: { user: { id: userId } },
    });

    return Promise.all(
      wallets.map(async (wallet) => {
        const tokenBalance = await this.web3Service.getTokenBalance(wallet.address);
        return { ...wallet, tokenBalance };
      }),
    );
  }

  async getWalletById(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) return null;
    const tokenBalance = await this.web3Service.getTokenBalance(wallet.address);
    return { ...wallet, tokenBalance };
  }

  async createWalletForUser(userId: string,) {
    // 1. 해당 유저가 가진 지갑 중 가장 큰 index 찾기
    const lastWallet = await this.prisma.wallet.findFirst({
      where: { user: { id: userId } },
      orderBy: { derivationIndex: 'desc' }, // derivationIndex 필드 필요!
    });
    const nextIndex = lastWallet ? (lastWallet.derivationIndex ?? 0) + 1 : 0;

    // 2. 지갑 생성
    const { address, mnemonic, privateKey } = createWalletFromEnvMnemonic(nextIndex);

    if (!isValidEthAddress(address)) {
      throw new BadRequestException('유효하지 않은 이더리움 주소입니다.');
    }

    const exists = await this.prisma.wallet.findUnique({ where: { address } });
    if (exists) throw new BadRequestException('이미 등록된 지갑 주소입니다.');

    const encryptedMnemonic = encrypt(mnemonic ?? '');
    const encryptedPrivateKey = encrypt(privateKey ?? '');
    const tokenBalance = await this.web3Service.getTokenBalance(address);

    // 3. derivationIndex 필드에 index 저장
    const wallet = await this.prisma.wallet.create({
      data: {
        address,
        mnemonic: encryptedMnemonic,
        privateKey: encryptedPrivateKey,
        tokenBalance,
        derivationIndex: nextIndex, // <--- 이 필드가 있어야 함!
        user: { connect: { id: userId } },
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { walletId: wallet.id },
    });

    return wallet;
  }

  async updateWallet(walletId: string, update: { address?: string; mnemonic?: string }) {
    if (update.address) {
      if (!isValidEthAddress(update.address)) {
        throw new BadRequestException('유효하지 않은 이더리움 주소입니다.');
      }
      const exists = await this.prisma.wallet.findUnique({ where: { address: update.address } });
      if (exists && exists.id !== walletId) {
        throw new BadRequestException('이미 등록된 지갑 주소입니다.');
      }
    }
    return this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        ...(update.address && { address: update.address }),
        ...(update.mnemonic && { mnemonic: update.mnemonic }),
      },
    });
  }

  async deleteWallet(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('지갑을 찾을 수 없습니다.');
    return this.prisma.wallet.delete({ where: { id: walletId } });
  }

  async getUserByWalletAddress(address: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { address },
      include: { user: true },
    });
    return wallet?.user;
  }

  async sendTransaction(userId: string, to: string, amount: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });
    if (!user?.wallet) throw new NotFoundException('지갑 없음');

    const encryptedPrivateKey = user.wallet.privateKey;
    if (!encryptedPrivateKey) throw new ForbiddenException('개인키 없음');
    const privateKey = decrypt(encryptedPrivateKey);

    const wallet = new ethers.Wallet(privateKey);
    // ...provider 연결, 트랜잭션 전송 등
    // await wallet.connect(provider).sendTransaction({ to, value: ... });
  }

  async getMnemonic(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });
    if (!user?.wallet) throw new NotFoundException('지갑 없음');
    const encryptedMnemonic = user.wallet.mnemonic;
    return { mnemonic: decrypt(encryptedMnemonic) };
  }

  async getDecryptedWallet(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) throw new NotFoundException('지갑을 찾을 수 없습니다.');

    return {
      ...wallet,
      mnemonic: decrypt(wallet.mnemonic),
      privateKey: wallet.privateKey ? decrypt(wallet.privateKey) : undefined,
    };
  }

  async refreshWalletBalance(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) return null;
    const tokenBalance = await this.web3Service.getTokenBalance(wallet.address);
    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { tokenBalance },
    });
    return { ...wallet, tokenBalance };
  }

}
