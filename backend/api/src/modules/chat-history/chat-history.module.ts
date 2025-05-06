import { Module, forwardRef } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryController } from './chat-history.controller';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [forwardRef(() => LlmModule)],
  controllers: [ChatHistoryController],
  providers: [ChatHistoryService],
  exports: [ChatHistoryService],
})
export class ChatHistoryModule {}
