import { Module, forwardRef } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { ConfigModule } from '@nestjs/config';
import { ChatHistoryModule } from '../chat-history/chat-history.module';
import { SuggestedFieldsModule } from '../suggested-fields/suggested-fields.module';

@Module({
  imports: [ConfigModule, forwardRef(() => ChatHistoryModule), SuggestedFieldsModule],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
