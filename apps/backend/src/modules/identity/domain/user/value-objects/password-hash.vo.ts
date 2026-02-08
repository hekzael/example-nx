import { DomainException } from '../../shared/domain.exception';

export class PasswordHash {
  private constructor(public readonly value: string) {}

  static create(value: string): PasswordHash {
    if (!value || value.trim().length < 10) {
      throw new DomainException('INVALID_PASSWORD_HASH', 'Password hash invalido.');
    }

    return new PasswordHash(value);
  }
}
