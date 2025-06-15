import { Chat } from '../../../../domain/chat';
import { ChatEntity } from '../entities/chat.entity';

export class ChatMapper {
  static toDomain(raw: ChatEntity): Chat {
    const domainEntity = new Chat();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.userId;
    domainEntity.message = raw.message;
    domainEntity.sender = raw.sender;
    domainEntity.isQuestionResponse = raw.isQuestionResponse;
    domainEntity.isUserInitiated = raw.isUserInitiated;
    domainEntity.analyzedByLlm = raw.analyzedByLlm;
    domainEntity.createAt = raw.createAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Chat): ChatEntity {
    const persistenceEntity = new ChatEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.userId = domainEntity.userId;
    persistenceEntity.message = domainEntity.message;
    persistenceEntity.sender = domainEntity.sender;
    persistenceEntity.isQuestionResponse = domainEntity.isQuestionResponse;
    persistenceEntity.isUserInitiated = domainEntity.isUserInitiated;
    persistenceEntity.analyzedByLlm = domainEntity.analyzedByLlm;
    persistenceEntity.createAt = domainEntity.createAt;
    return persistenceEntity;
  }
}
