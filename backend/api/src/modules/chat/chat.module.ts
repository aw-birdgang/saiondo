import { forwardRef, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { LlmModule } from '@modules/llm/llm.module';
import { ChatGateway } from './chat.gateway';
import { ChannelModule } from '../channel/channel.module';
import { UserModule } from '../user/user.module';
import { PersonaProfileModule } from '../persona-profile/persona-profile.module';
import { BasicQuestionWithAnswerService } from '../basic-question-with-answer/basic-question-with-answer.service';
import { RelationalChatPersistenceModule } from '../../database/chat/infrastructure/persistence/relational/relational-persistence.module';
import { PointModule } from '../point/point.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => LlmModule),
    UserModule,
    PersonaProfileModule,
    ChannelModule,
    RelationalChatPersistenceModule,
    PointModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, BasicQuestionWithAnswerService],
  exports: [ChatService],
})
export class ChatModule {}
