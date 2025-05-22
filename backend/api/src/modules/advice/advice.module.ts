import {Module} from '@nestjs/common';
import {AdviceService} from './advice.service';
import {AdviceController} from './advice.controller';
import {PrismaModule} from "@common/prisma/prisma.module";
import {LlmModule} from "@modules/llm/llm.module";

@Module({
  imports: [PrismaModule, LlmModule],
  controllers: [AdviceController],
  providers: [AdviceService],
  exports: [AdviceService],
})
export class AdviceModule {}
