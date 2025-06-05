import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class Web3Service implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;
  private tokenContract: ethers.Contract;
  private ownerWallet: ethers.Wallet;

  constructor(private readonly prisma: PrismaService) {
    const rpcUrl = process.env.WEB3_RPC_URL!;
    const contractAddress = process.env.TOKEN_CONTRACT_ADDRESS!;
    const abiPath = process.env.TOKEN_CONTRACT_ABI_PATH!;
    const privateKey = process.env.WEB3_OWNER_PRIVATE_KEY!;

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    const abi = JSON.parse(fs.readFileSync(path.resolve(abiPath), 'utf-8'));
    this.ownerWallet = new ethers.Wallet(privateKey, this.provider);
    this.tokenContract = new ethers.Contract(contractAddress, abi, this.ownerWallet);
  }

  async transferToken(to: string, amount: string | number) {
    // amount는 토큰 소수점 단위까지 맞춰서 전달해야 함
    const decimals = await this.tokenContract.decimals();
    const value = ethers.parseUnits(amount.toString(), decimals);
    const tx = await this.tokenContract.transfer(to, value);
    return tx.hash;
  }

  async getTokenBalance(address: string): Promise<string> {
    const decimals = await this.tokenContract.decimals();
    const balance = await this.tokenContract.balanceOf(address);
    // balance는 BigInt, 사람이 읽을 수 있는 단위로 변환
    return ethers.formatUnits(balance, decimals);
  }

  // Transfer 이벤트 리스너 등록 (NestJS lifecycle hook)
  async onModuleInit() {
    this.tokenContract.on('Transfer', async (from, to, value, event) => {
      // DB에 등록된 지갑만 동기화
      for (const addr of [from, to]) {
        const wallet = await this.prisma.wallet.findUnique({ where: { address: addr } });
        if (wallet) {
          const tokenBalance = await this.getTokenBalance(addr);
          await this.prisma.wallet.update({
            where: { id: wallet.id },
            data: { tokenBalance },
          });
        }
      }
    });
  }
}