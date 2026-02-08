import { DomainException } from '../../shared/domain.exception';

export class UserId {
  private constructor(public readonly value: string) {}

  static create(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new DomainException('INVALID_USER_ID', 'UserId invalido.');
    }

    return new UserId(value);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
