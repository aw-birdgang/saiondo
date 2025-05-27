import {Module} from '@nestjs/common';
import {AdviceService} from './advice.service';
import {AdviceController} from './advice.controller';
import {PrismaModule} from "@common/prisma/prisma.module";
import {LlmModule} from "@modules/llm/llm.module";
import {ChannelModule} from "@modules/channel/channel.module";

@Module({
  imports: [PrismaModule, LlmModule, ChannelModule],
  controllers: [AdviceController],
  providers: [AdviceService],
  exports: [AdviceService],
})
export class AdviceModule {}
