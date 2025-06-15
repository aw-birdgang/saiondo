import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ChatRepository} from '../chat-history.repository';
import {ChatEntity} from './entities/chat.entity';
import {ChatRelationalRepository} from './repositories/chat.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity])],
  providers: [
    {
      provide: ChatRepository,
      useClass: ChatRelationalRepository,
    },
  ],
  exports: [ChatRepository],
})
export class RelationalChatPersistenceModule {}
