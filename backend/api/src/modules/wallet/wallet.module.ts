import {Module} from '@nestjs/common';
import {WalletService} from './wallet.service';
import {PrismaService} from '@common/prisma/prisma.service';
import {WalletController} from "@modules/wallet/wallet.controller";

@Module({
  controllers: [WalletController],
  providers: [WalletService, PrismaService],
  exports: [WalletService],
})
export class WalletModule {}
