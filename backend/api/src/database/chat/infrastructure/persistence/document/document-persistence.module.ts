import { Module } from '@nestjs/common';
import { ChatRepository } from '../chat.repository';

@Module({
  exports: [ChatRepository],
})
export class DocumentChatPersistenceModule {}
