import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class Web3Service implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;
  private tokenContract: ethers.Contract;
  private ownerWallet: ethers.Wallet;
  private readonly logger = new Logger(Web3Service.name);

  // 폴링 주기(ms)
  private readonly POLL_INTERVAL = 60 * 1000; // 1분
  private lastBlock: number | null = null;

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

  // 개선: 이벤트 구독 대신 polling 방식으로 Transfer 이벤트 동기화
  async onModuleInit() {
    this.logger.log('Web3Service polling for Transfer events...');
    //this.startPollingTransferEvents();
  }

  private async startPollingTransferEvents() {
    // 최초 시작 시 마지막 블록을 기록
    if (this.lastBlock === null) {
      this.lastBlock = await this.provider.getBlockNumber();
    }

    setInterval(async () => {
      try {
        const currentBlock = await this.provider.getBlockNumber();
        // 최근 1000블록까지만 조회(너무 과거까지 조회 방지)
        const fromBlock = Math.max((this.lastBlock ?? currentBlock) + 1, currentBlock - 1000);
        const toBlock = currentBlock;

        if (fromBlock > toBlock) {
          // 새 블록 없음
          return;
        }

        // Transfer 이벤트 필터 생성
        const filter = this.tokenContract.filters.Transfer();
        const events = await this.tokenContract.queryFilter(filter, fromBlock, toBlock);

        for (const event of events) {
          const parsed = this.tokenContract.interface.parseLog(event);
          if (!parsed) continue;

          const from = parsed.args[0];
          const to = parsed.args[1];
          for (const addr of [from, to]) {
            const wallet = await this.prisma.wallet.findUnique({ where: { address: addr } });
            if (wallet) {
              const tokenBalance = await this.getTokenBalance(addr);
              await this.prisma.wallet.update({
                where: { id: wallet.id },
                data: { tokenBalance },
              });
              this.logger.log(`Wallet ${addr} balance updated: ${tokenBalance}`);
            }
          }
        }

        this.lastBlock = toBlock;
      } catch (e) {
        this.logger.error('Error polling Transfer events:', e);
      }
    }, this.POLL_INTERVAL);
  }
}
