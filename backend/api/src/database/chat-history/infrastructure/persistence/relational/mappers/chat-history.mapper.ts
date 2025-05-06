import {ChatHistory} from "../../../../domain/chat-history";
import {ChatHistoryEntity} from "../entities/chat-history.entity";

export class ChatHistoryMapper {
  static toDomain(raw: ChatHistoryEntity): ChatHistory {
    const domainEntity = new ChatHistory();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.userId;
    domainEntity.message = raw.message;
    domainEntity.sender = raw.sender;
    domainEntity.isQuestionResponse = raw.isQuestionResponse;
    domainEntity.isUserInitiated = raw.isUserInitiated;
    domainEntity.analyzedByLlm = raw.analyzedByLlm;
    domainEntity.timestamp = raw.timestamp;
    return domainEntity;
  }

  static toPersistence(domainEntity: ChatHistory): ChatHistoryEntity {
    const persistenceEntity = new ChatHistoryEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.userId = domainEntity.userId;
    persistenceEntity.message = domainEntity.message;
    persistenceEntity.sender = domainEntity.sender;
    persistenceEntity.isQuestionResponse = domainEntity.isQuestionResponse;
    persistenceEntity.isUserInitiated = domainEntity.isUserInitiated;
    persistenceEntity.analyzedByLlm = domainEntity.analyzedByLlm;
    persistenceEntity.timestamp = domainEntity.timestamp;
    return persistenceEntity;
  }
}
