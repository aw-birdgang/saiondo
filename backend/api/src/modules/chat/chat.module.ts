import {forwardRef, Module} from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService} from './chat.service';
import {PrismaModule} from '../../common/prisma/prisma.module';
import {LlmModule} from '@modules/llm/llm.module';
import {ChatGateway} from './chat.gateway';
import {ChannelService} from '@modules/channel/channel.service';
import {UserModule} from '../user/user.module';
import {PersonaProfileModule} from '../persona-profile/persona-profile.module';
import {BasicQuestionWithAnswerService} from '../basic-question-with-answer/basic-question-with-answer.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => LlmModule),
    UserModule,
    PersonaProfileModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChannelService,
    BasicQuestionWithAnswerService,
    ChatService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
