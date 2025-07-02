import { Module } from '@nestjs/common';
import { RelationalTokenTransferRepository } from './repositories/token-transfer.repository';
import { PrismaService } from '@common/prisma/prisma.service';

@Module({
  providers: [RelationalTokenTransferRepository, PrismaService],
  exports: [RelationalTokenTransferRepository],
})
export class TokenTransferRelationalPersistenceModule {}