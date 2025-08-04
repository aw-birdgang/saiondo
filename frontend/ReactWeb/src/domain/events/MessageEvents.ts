import { DomainEvent } from './DomainEvent';
import { MessageId } from '../value-objects/MessageId';
import { UserId } from '../value-objects/UserId';
import { ChannelId } from '../value-objects/ChannelId';

/**
 * 메시지가 전송되었을 때 발생하는 이벤트
 */
export class MessageSentEvent extends DomainEvent {
  constructor(
    public readonly messageId: MessageId,
    public readonly senderId: UserId,
    public readonly channelId: ChannelId,
    public readonly content: string,
    public readonly sentAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'MessageSent';
  }
}

/**
 * 메시지가 수정되었을 때 발생하는 이벤트
 */
export class MessageEditedEvent extends DomainEvent {
  constructor(
    public readonly messageId: MessageId,
    public readonly editorId: UserId,
    public readonly oldContent: string,
    public readonly newContent: string,
    public readonly editedAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'MessageEdited';
  }
}

/**
 * 메시지가 삭제되었을 때 발생하는 이벤트
 */
export class MessageDeletedEvent extends DomainEvent {
  constructor(
    public readonly messageId: MessageId,
    public readonly deleterId: UserId,
    public readonly deletedAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'MessageDeleted';
  }
}

/**
 * 메시지에 반응이 추가되었을 때 발생하는 이벤트
 */
export class MessageReactionAddedEvent extends DomainEvent {
  constructor(
    public readonly messageId: MessageId,
    public readonly userId: UserId,
    public readonly reaction: string,
    public readonly addedAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'MessageReactionAdded';
  }
}

/**
 * 메시지 반응이 제거되었을 때 발생하는 이벤트
 */
export class MessageReactionRemovedEvent extends DomainEvent {
  constructor(
    public readonly messageId: MessageId,
    public readonly userId: UserId,
    public readonly reaction: string,
    public readonly removedAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'MessageReactionRemoved';
  }
} 