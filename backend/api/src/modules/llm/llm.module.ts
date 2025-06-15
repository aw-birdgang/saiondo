import {forwardRef, Module} from '@nestjs/common';
import {LlmController} from './llm.controller';
import {LlmService} from './llm.service';
import {ConfigModule} from '@nestjs/config';
import {SuggestedFieldsModule} from '../suggested-fields/suggested-fields.module';
import {ChatModule} from "@modules/chat/chat.module";

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => ChatModule),
    SuggestedFieldsModule
  ],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
