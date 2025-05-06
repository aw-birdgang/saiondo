import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule,],
    controllers: [LlmController],
    providers: [LlmService],
})
export class LlmModule {}
