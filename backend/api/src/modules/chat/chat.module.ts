import {forwardRef, Module} from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService} from './chat.service';
import {PrismaModule} from '../../common/prisma/prisma.module';
import {LlmModule} from "@modules/llm/llm.module";
import {ChatGateway} from './chat.gateway';
import {PersonaProfileService} from '../persona-profile/persona-profile.service';
import {ChannelService} from "@modules/channel/channel.service";
import {AssistantService} from "@modules/assistant/assistant.service";

@Module({
  imports: [
      PrismaModule,
      forwardRef(() => LlmModule),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    AssistantService,
    ChannelService,
    PersonaProfileService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
