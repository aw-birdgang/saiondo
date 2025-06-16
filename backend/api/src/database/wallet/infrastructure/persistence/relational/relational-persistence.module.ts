import {Module} from '@nestjs/common';
import {RelationalWalletRepository} from './repositories/wallet.repository';
import {PrismaService} from "@common/prisma/prisma.service";

@Module({
  providers: [
    PrismaService,
    RelationalWalletRepository,
  ],
  exports: [RelationalWalletRepository],
})
export class RelationalPersistenceModule {}
