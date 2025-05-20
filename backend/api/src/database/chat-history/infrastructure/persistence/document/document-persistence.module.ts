import { Module } from '@nestjs/common';
import { ChatHistoryRepository } from '../chat-history.repository';

@Module({
  exports: [ChatHistoryRepository],
})
export class DocumentChatHistoryPersistenceModule {}
