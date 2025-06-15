import { Module } from '@nestjs/common';
import { RelationalChannelRepository } from './repositories/channel.repository';
import { PrismaService } from '@common/prisma/prisma.service';

@Module({
  providers: [RelationalChannelRepository, PrismaService],
  exports: [RelationalChannelRepository],
})
export class ChannelRelationalPersistenceModule {}
