export class ChannelId {
  private constructor(private readonly value: string) {
    this.validate();
  }

  static create(id: string): ChannelId {
    return new ChannelId(id);
  }

  static generate(): ChannelId {
    return new ChannelId(crypto.randomUUID());
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('Channel ID is required');
    }

    if (this.value.length > 36) {
      throw new Error('Channel ID is too long');
    }
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: ChannelId): boolean {
    return this.value === other.value;
  }
} 