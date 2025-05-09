import { Module, forwardRef } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import {LlmModule} from "@modules/llm/llm.module";
import {LlmService} from "@modules/llm/llm.service";

@Module({
  imports: [PrismaModule, forwardRef(() => LlmModule)],
  controllers: [ChatController],
  providers: [ChatService, LlmService],
})
export class ChatModule {}
