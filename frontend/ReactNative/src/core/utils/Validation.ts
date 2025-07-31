export class Validation {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidDate(date: string): boolean {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }

  static isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  static hasMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  static hasMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  static isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
  }

  static isAlphaNumeric(value: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(value);
  }

  static containsOnlyLetters(value: string): boolean {
    return /^[a-zA-Z\s]+$/.test(value);
  }

  static validateRequired(value: any, fieldName: string): string | null {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  }

  static validateEmail(email: string): string | null {
    if (!this.isValidEmail(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  static validatePassword(password: string): string | null {
    const validation = this.isValidPassword(password);
    if (!validation.isValid) {
      return validation.errors[0] || 'Password validation failed'; // Return first error
    }
    return null;
  }

  static validateConfirmPassword(password: string, confirmPassword: string): string | null {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  }

  static validateForm<T extends Record<string, any>>(
    data: T,
    rules: Record<keyof T, (value: any) => string | null>
  ): Record<keyof T, string | null> {
    const errors: Record<keyof T, string | null> = {} as Record<keyof T, string | null>;

    for (const [field, validator] of Object.entries(rules)) {
      const value = data[field as keyof T];
      const error = validator(value);
      errors[field as keyof T] = error || null;
    }

    return errors;
  }

  static hasErrors(errors: Record<string, string | null>): boolean {
    return Object.values(errors).some(error => error !== null);
  }
} 