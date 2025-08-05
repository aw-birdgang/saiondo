export class Email {
  private constructor(private readonly value: string) {
    this.validate();
  }

  static create(email: string): Email {
    return new Email(email);
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new Error('Invalid email format');
    }

    if (this.value.length > 254) {
      throw new Error('Email is too long');
    }
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
