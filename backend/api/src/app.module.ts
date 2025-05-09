import {Module} from '@nestjs/common';
import {LlmModule} from "./modules/llm/llm.module";
import {ConfigModule} from "@nestjs/config";
import commonConfig from "./config/common.config";
import {PrismaModule} from "./common/prisma/prisma.module";
import {UserModule} from "@modules/user/user.module";
import {AdviceReportModule} from "@modules/advice-report/advice-report.module";
import {ChatHistoryModule} from "@modules/chat-history/chat-history.module";
import {PersonaProfileModule} from "@modules/persona-profile/persona-profile.module";
import {RelationshipModule} from "@modules/relationship/relationship.module";
import {CategoryCodeModule} from './modules/category-code/category-code.module';
import {QuestionTemplateModule} from "@modules/question-template/question-template.module";
import {PushScheduleModule} from "@modules/push-schedule/push-schedule.module";
import {UserAnswerModule} from "@modules/user-answer/user-answer.module";
import {RoomModule} from './modules/room/room.module';
import {ChatModule} from "@modules/chat/chat.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        commonConfig,
      ],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    LlmModule,
    UserModule,
    AdviceReportModule,
    ChatHistoryModule,
    PersonaProfileModule,
    RelationshipModule,
    CategoryCodeModule,
    QuestionTemplateModule,
    PushScheduleModule,
    UserAnswerModule,
    RoomModule,
    ChatModule,
  ],
})
export class AppModule {}
