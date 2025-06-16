import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.services';
import {PrismaService} from '@common/prisma/prisma.service';
import {WalletModule} from '../wallet/wallet.module';
import {
  RelationalUserPersistenceModule
} from '../../database/user/infrastructure/persistence/relational/relational-persistence.module';
import {Web3Module} from "@modules/web3/web3.module";
import {Web3Service} from '../web3/web3.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    Web3Service
  ],
  exports: [UserService],
  imports: [
    Web3Module,
    WalletModule,
    RelationalUserPersistenceModule,
  ],
})
export class UserModule {}
