import { Module, forwardRef } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import {ConfigModule} from "@nestjs/config";
import { ChatHistoryModule } from '../chat-history/chat-history.module';

@Module({
    imports: [ConfigModule, forwardRef(() => ChatHistoryModule)],
    controllers: [LlmController],
    providers: [LlmService],
    exports: [LlmService],
})
export class LlmModule {}
