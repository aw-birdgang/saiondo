import {forwardRef, Module} from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService} from './chat.service';
import {PrismaModule} from '../../common/prisma/prisma.module';
import {LlmModule} from "@modules/llm/llm.module";
import {LlmService} from "@modules/llm/llm.service";
import {ChatGateway} from './chat.gateway';

@Module({
  imports: [PrismaModule, forwardRef(() => LlmModule)],
  controllers: [ChatController],
  providers: [ChatService, LlmService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
