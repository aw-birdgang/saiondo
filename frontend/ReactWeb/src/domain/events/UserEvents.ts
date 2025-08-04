import { DomainEvent } from './DomainEvent';
import { UserId } from '../value-objects/UserId';
import { ChannelId } from '../value-objects/ChannelId';

/**
 * 사용자가 채널에 참여했을 때 발생하는 이벤트
 */
export class UserJoinedChannelEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly channelId: ChannelId,
    public readonly joinedAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'UserJoinedChannel';
  }
}

/**
 * 사용자가 채널을 나갔을 때 발생하는 이벤트
 */
export class UserLeftChannelEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly channelId: ChannelId,
    public readonly leftAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'UserLeftChannel';
  }
}

/**
 * 사용자가 온라인 상태가 되었을 때 발생하는 이벤트
 */
export class UserWentOnlineEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly wentOnlineAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'UserWentOnline';
  }
}

/**
 * 사용자가 오프라인 상태가 되었을 때 발생하는 이벤트
 */
export class UserWentOfflineEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly wentOfflineAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'UserWentOffline';
  }
}

/**
 * 사용자 프로필이 업데이트되었을 때 발생하는 이벤트
 */
export class UserProfileUpdatedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly updatedFields: string[],
    public readonly updatedAt: Date
  ) {
    super();
  }

  get eventName(): string {
    return 'UserProfileUpdated';
  }
} 