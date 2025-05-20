import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from '@common/prisma/prisma.service';
import { AssistantModule } from '@modules/assistant/assistant.module';

@Module({
  imports: [AssistantModule],
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService],
  exports: [ChannelService],
})
export class ChannelModule {}
