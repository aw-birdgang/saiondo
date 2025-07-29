import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from '@common/prisma/prisma.service';
import { AssistantModule } from '@modules/assistant/assistant.module';
import { ChannelRelationalPersistenceModule } from '../../database/channel/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [AssistantModule, ChannelRelationalPersistenceModule],
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService],
  exports: [ChannelService],
})
export class ChannelModule {}
