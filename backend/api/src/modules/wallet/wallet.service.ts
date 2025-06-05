import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {createWalletWithMnemonic, decrypt, encrypt} from '@common/utils/wallet.util';
import {ethers} from 'ethers';
import {Web3Service} from "@modules/web3/web3.service";

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly web3Service: Web3Service,
  ) {}

  async getAllWallets() {
    return this.prisma.wallet.findMany({include: {user: true}});
  }

  // 특정 유저의 모든 지갑 조회
  async getWalletsByUser(userId: string) {
    const wallets = await this.prisma.wallet.findMany({
      where: { user: { id: userId } },
    });

    // 각 지갑의 토큰 잔액을 병렬로 조회
    const walletsWithBalance = await Promise.all(
      wallets.map(async (wallet) => {
        const tokenBalance = await this.web3Service.getTokenBalance(wallet.address);
        return { ...wallet, tokenBalance };
      }),
    );

    return walletsWithBalance;
  }

  // 단일 지갑 조회 (id 기준)
  async getWalletById(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) return null;
    const tokenBalance = await this.web3Service.getTokenBalance(wallet.address);
    return { ...wallet, tokenBalance };
  }

  // 지갑 생성 (address, mnemonic 직접 입력)
  async createWallet(userId: string, address: string, mnemonic: string) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new BadRequestException('유효하지 않은 이더리움 주소입니다.');
    }
    // address 중복 체크
    const exists = await this.prisma.wallet.findUnique({ where: { address } });
    if (exists) throw new BadRequestException('이미 등록된 지갑 주소입니다.');

    return this.prisma.wallet.create({
      data: {
        address,
        mnemonic,
        user: {connect: {id: userId}},
      },
    });
  }

  // 랜덤 지갑 생성 (mnemonic 자동 생성)
  async createRandomWalletForUser(userId: string) {
    const { address, mnemonic } = createWalletWithMnemonic();
    return this.createWallet(userId, address, mnemonic ?? '');
  }

  // 지갑 정보 수정 (address, mnemonic)
  async updateWallet(walletId: string, update: {address?: string; mnemonic?: string}) {
    // address가 변경될 경우 유효성 및 중복 체크
    if (update.address) {
      if (!/^0x[a-fA-F0-9]{40}$/.test(update.address)) {
        throw new BadRequestException('유효하지 않은 이더리움 주소입니다.');
      }
      const exists = await this.prisma.wallet.findUnique({where: {address: update.address}});
      if (exists && exists.id !== walletId) {
        throw new BadRequestException('이미 등록된 지갑 주소입니다.');
      }
    }
    return this.prisma.wallet.update({
      where: {id: walletId},
      data: {
        ...(update.address && {address: update.address}),
        ...(update.mnemonic && {mnemonic: update.mnemonic}),
      },
    });
  }

  // 지갑 삭제
  async deleteWallet(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({where: {id: walletId}});
    if (!wallet) throw new NotFoundException('지갑을 찾을 수 없습니다.');
    return this.prisma.wallet.delete({where: {id: walletId}});
  }

  // 지갑 주소로 유저 조회
  async getUserByWalletAddress(address: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {address},
      include: {user: true},
    });
    return wallet?.user;
  }

  /**
   * 유저에 랜덤 mnemonic 기반 지갑을 생성하고 연결
   */
  async createWalletForUser(userId: string) {
    // 1. 랜덤 mnemonic, privateKey, address 생성
    const { address, mnemonic, privateKey } = createWalletWithMnemonic();

    // 2. address 유효성 검사
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new BadRequestException('유효하지 않은 이더리움 주소입니다.');
    }

    // 3. address 중복 체크
    const exists = await this.prisma.wallet.findUnique({ where: { address } });
    if (exists) throw new BadRequestException('이미 등록된 지갑 주소입니다.');

    // 4. mnemonic, privateKey 암호화
    const encryptedMnemonic = encrypt(mnemonic ?? '');
    const encryptedPrivateKey = encrypt(privateKey ?? '');

    // 5. 지갑 생성 및 유저 연결
    const wallet = await this.prisma.wallet.create({
      data: {
        address,
        mnemonic: encryptedMnemonic,
        privateKey: encryptedPrivateKey,
        user: { connect: { id: userId } },
      },
    });

    // 6. (선택) User의 walletId 필드가 있다면 연결
    await this.prisma.user.update({
      where: { id: userId },
      data: { walletId: wallet.id },
    });

    return wallet;
  }

  /**
   * 랜덤 mnemonic만 생성해서 반환
   */
  generateMnemonic() {
    const { mnemonic } = createWalletWithMnemonic();
    return { mnemonic: mnemonic ?? '' };
  }

  /**
   * 서버에서 유저 지갑으로 트랜잭션을 서명/전송할 때
   */
  async sendTransaction(userId: string, to: string, amount: string) {
    // 1. 유저의 대표 지갑 조회
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });
    if (!user?.wallet) throw new NotFoundException('지갑 없음');

    // 2. 암호화된 privateKey 복호화
    const encryptedPrivateKey = user.wallet.privateKey;
    if (!encryptedPrivateKey) throw new ForbiddenException('개인키 없음');
    const privateKey = decrypt(encryptedPrivateKey);

    // 3. ethers.js로 서명 및 전송
    const wallet = new ethers.Wallet(privateKey);
    // ...provider 연결, 트랜잭션 전송 등
    // await wallet.connect(provider).sendTransaction({ to, value: ... });
  }

  /**
   * 유저가 mnemonic 복구 요청 시
   */
  async getMnemonic(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });
    if (!user?.wallet) throw new NotFoundException('지갑 없음');
    const encryptedMnemonic = user.wallet.mnemonic;
    return { mnemonic: decrypt(encryptedMnemonic) };
  }

  /**
   * 지갑 정보(복호화 포함) 반환
   */
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

  // on-demand: 지갑 잔액 새로고침
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
