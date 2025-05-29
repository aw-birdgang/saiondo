import {Module} from '@nestjs/common';
import {LlmModule} from './modules/llm/llm.module';
import {ConfigModule} from '@nestjs/config';
import {PrismaModule} from './common/prisma/prisma.module';
import {UserModule} from '@modules/user/user.module';
import {AdviceModule} from '@modules/advice/advice.module';
import {ChatHistoryModule} from '@modules/chat-history/chat-history.module';
import {PersonaProfileModule} from '@modules/persona-profile/persona-profile.module';
import {CategoryCodeModule} from './modules/category-code/category-code.module';
import {QuestionTemplateModule} from '@modules/question-template/question-template.module';
import {PushScheduleModule} from '@modules/push-schedule/push-schedule.module';
import {UserAnswerModule} from '@modules/user-answer/user-answer.module';
import {ChatModule} from '@modules/chat/chat.module';
import {AuthModule} from './modules/auth/auth.module';
import commonConfig from './config/common.config';
import authConfig from './config/auth.config';
import {ChannelModule} from './modules/channel/channel.module';
import {AssistantModule} from '@modules/assistant/assistant.module';
import {CoupleAnalysisModule} from './modules/couple-analysis/couple-analysis.module';
import {EventModule} from './modules/event/event.module';
import {PointModule} from "@modules/point/point.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [commonConfig, authConfig],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ChannelModule,
    CoupleAnalysisModule,
    PersonaProfileModule,
    AssistantModule,
    ChatModule,
    ChatHistoryModule,
    LlmModule,
    CategoryCodeModule,
    PointModule,
    AdviceModule,
    EventModule,
    QuestionTemplateModule,
    PushScheduleModule,
    UserAnswerModule,

  ],
})
export class AppModule {}
