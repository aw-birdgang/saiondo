import {forwardRef, Module} from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService} from './chat.service';
import {PrismaModule} from '../../common/prisma/prisma.module';
import {LlmModule} from '@modules/llm/llm.module';
import {ChatGateway} from './chat.gateway';
import {ChannelService} from '@modules/channel/channel.service';
import {ChatHistoryService} from "@modules/chat-history/chat-history.service";
import {UserModule} from '../user/user.module';
import {PersonaProfileModule} from '../persona-profile/persona-profile.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => LlmModule),
    UserModule,
    PersonaProfileModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatHistoryService,
    ChatGateway,
    ChannelService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
