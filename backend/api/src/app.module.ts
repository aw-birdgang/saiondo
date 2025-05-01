import {Module} from '@nestjs/common';
import {LlmModule} from "./llm/llm.module";
import {ConfigModule} from "@nestjs/config";
import commonConfig from "./config/common.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        commonConfig,
      ],
      envFilePath: ['.env'],
    }),
    LlmModule,
  ],
})
export class AppModule {}
