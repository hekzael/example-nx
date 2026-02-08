import { DomainException } from '../../shared/domain.exception';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    if (!value || !EMAIL_REGEX.test(value)) {
      throw new DomainException('INVALID_EMAIL', 'Email invalido.');
    }

    return new Email(value.toLowerCase());
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
