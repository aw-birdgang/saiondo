export class UserId {
  private constructor(private readonly value: string) {
    this.validate();
  }

  static create(id: string): UserId {
    return new UserId(id);
  }

  static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (this.value.length > 36) {
      throw new Error('User ID is too long');
    }
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
