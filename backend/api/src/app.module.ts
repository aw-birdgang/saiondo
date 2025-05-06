import {Module} from '@nestjs/common';
import {LlmModule} from "./llm/llm.module";
import {ConfigModule} from "@nestjs/config";
import commonConfig from "./config/common.config";
import {PrismaModule} from "./common/prisma/prisma.module";

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
  ],
})
export class AppModule {}
