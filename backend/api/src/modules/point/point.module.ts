import {Module} from '@nestjs/common';
import {PointService} from './point.service';
import {PointController} from './point.controller';
import {PrismaService} from "@common/prisma/prisma.service";
import {TokenTransferModule} from '../token-transfer/token-transfer.module';
import {WalletModule} from '../wallet/wallet.module';
import {Web3Module} from "@modules/web3/web3.module";

@Module({
  imports: [Web3Module, TokenTransferModule, WalletModule],
  controllers: [PointController],
  providers: [PointService, PrismaService],
  exports: [PointService],
})
export class PointModule {}
