import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.services';
import { PrismaService } from '@common/prisma/prisma.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
  imports: [WalletModule],
})
export class UserModule {}
