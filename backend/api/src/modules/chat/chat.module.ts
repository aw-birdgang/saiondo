import {forwardRef, Module} from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService} from './chat.service';
import {PrismaModule} from '../../common/prisma/prisma.module';
import {LlmModule} from "@modules/llm/llm.module";
import {ChatGateway} from './chat.gateway';
import {RoomService} from '../room/room.service';
import {PersonaProfileService} from '../persona-profile/persona-profile.service';

@Module({
  imports: [
      PrismaModule,
      forwardRef(() => LlmModule),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    RoomService,
    PersonaProfileService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
