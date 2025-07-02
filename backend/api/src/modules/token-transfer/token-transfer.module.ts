import {Module} from '@nestjs/common';
import {TokenTransferService} from './token-transfer.service';
import {TokenTransferController} from './token-transfer.controller';
import {PrismaService} from '@common/prisma/prisma.service';
import {
  TokenTransferRelationalPersistenceModule
} from "../../database/token-transfer/infrastructure/persistence/relational/relational-persistence.module";

@Module({
  imports: [TokenTransferRelationalPersistenceModule],
  providers: [TokenTransferService, PrismaService],
  controllers: [TokenTransferController],
  exports: [TokenTransferService],
})
export class TokenTransferModule {}
