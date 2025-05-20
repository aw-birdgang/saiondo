import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatHistoryRepository } from '../chat-history.repository';
import { ChatHistoryEntity } from './entities/chat-history.entity';
import { ChatHistoryRelationalRepository } from './repositories/chat-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatHistoryEntity])],
  providers: [
    {
      provide: ChatHistoryRepository,
      useClass: ChatHistoryRelationalRepository,
    },
  ],
  exports: [ChatHistoryRepository],
})
export class RelationalChatHistoryPersistenceModule {}
