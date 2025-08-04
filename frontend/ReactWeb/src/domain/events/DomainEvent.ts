/**
 * 도메인 이벤트 기본 클래스
 * 모든 도메인 이벤트는 이 클래스를 상속받아야 합니다.
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor() {
    this.occurredOn = new Date();
    this.eventId = crypto.randomUUID();
  }

  abstract get eventName(): string;
} 