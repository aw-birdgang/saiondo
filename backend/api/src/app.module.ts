import {Module} from '@nestjs/common';
import {LlmModule} from './modules/llm/llm.module';
import {ConfigModule} from '@nestjs/config';
import {PrismaModule} from './common/prisma/prisma.module';
import {UserModule} from '@modules/user/user.module';
import {AdviceModule} from '@modules/advice/advice.module';
import {PersonaProfileModule} from '@modules/persona-profile/persona-profile.module';
import {CategoryCodeModule} from './modules/category-code/category-code.module';
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
import {BasicQuestionWithAnswerModule} from "@modules/basic-question-with-answer/basic-question-with-answer.module";
import {WalletModule} from "@modules/wallet/wallet.module";
import {PaymentSubscriptionModule} from "@modules/payment-subscription/payment-subscription.module";
import {LabelModule} from "@modules/label/label.module";
import {HealthModule} from "@modules/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [commonConfig, authConfig],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UserModule,
    ChannelModule,
    WalletModule,
    CoupleAnalysisModule,
    PersonaProfileModule,
    AssistantModule,
    ChatModule,
    LlmModule,
    CategoryCodeModule,
    PaymentSubscriptionModule,
    PointModule,
    AdviceModule,
    EventModule,
    BasicQuestionWithAnswerModule,
    PushScheduleModule,
    UserAnswerModule,
    LabelModule,
    // Web3Module,
  ],
})
export class AppModule {}
