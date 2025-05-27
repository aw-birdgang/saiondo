import {forwardRef, Module} from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService} from './chat.service';
import {PrismaModule} from '../../common/prisma/prisma.module';
import {LlmModule} from '@modules/llm/llm.module';
import {ChatGateway} from './chat.gateway';
import {PersonaProfileService} from '../persona-profile/persona-profile.service';
import {ChannelService} from '@modules/channel/channel.service';
import {ChatHistoryService} from "@modules/chat-history/chat-history.service";
import {UserModule} from '../user/user.module';

@Module({
  imports: [PrismaModule, forwardRef(() => LlmModule), UserModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatHistoryService,
    ChatGateway,
    ChannelService,
    PersonaProfileService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
