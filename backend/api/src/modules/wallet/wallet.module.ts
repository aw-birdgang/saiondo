import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from '@modules/wallet/wallet.controller';
import { Web3Module } from '@modules/web3/web3.module';
import { RelationalPersistenceModule } from '../../database/wallet/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalUserRepository } from '../../database/user/infrastructure/persistence/relational/repositories/user.repository';

@Module({
  imports: [Web3Module, RelationalPersistenceModule],
  controllers: [WalletController],
  providers: [WalletService, RelationalUserRepository],
  exports: [WalletService],
})
export class WalletModule {}
