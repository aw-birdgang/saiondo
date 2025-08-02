export class MessageId {
  private constructor(private readonly value: string) {
    this.validate();
  }

  static create(id: string): MessageId {
    return new MessageId(id);
  }

  static generate(): MessageId {
    return new MessageId(crypto.randomUUID());
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('Message ID is required');
    }

    if (this.value.length > 36) {
      throw new Error('Message ID is too long');
    }
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: MessageId): boolean {
    return this.value === other.value;
  }
} 