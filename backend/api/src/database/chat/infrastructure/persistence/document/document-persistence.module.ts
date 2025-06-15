import {Module} from '@nestjs/common';
import {ChatRepository} from '../chat-history.repository';

@Module({
  exports: [ChatRepository],
})
export class DocumentChatPersistenceModule {}
