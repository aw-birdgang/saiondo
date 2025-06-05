import {Module} from '@nestjs/common';
import {WalletService} from './wallet.service';
import {PrismaService} from '@common/prisma/prisma.service';
import {WalletController} from "@modules/wallet/wallet.controller";
import {Web3Module} from "@modules/web3/web3.module";

@Module({
  imports: [Web3Module],
  controllers: [WalletController],
  providers: [WalletService, PrismaService],
  exports: [WalletService],
})
export class WalletModule {}
