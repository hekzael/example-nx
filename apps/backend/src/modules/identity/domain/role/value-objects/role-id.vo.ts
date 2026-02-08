import { DomainException } from '../../shared/domain.exception';

export class RoleId {
  private constructor(public readonly value: string) {}

  static create(value: string): RoleId {
    if (!value || value.trim().length === 0) {
      throw new DomainException('INVALID_ROLE_ID', 'RoleId invalido.');
    }

    return new RoleId(value);
  }

  equals(other: RoleId): boolean {
    return this.value === other.value;
  }
}
