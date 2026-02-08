import { DomainException } from '../../shared/domain.exception';

export class RoleName {
  private constructor(public readonly value: string) {}

  static create(value: string): RoleName {
    if (!value || value.trim().length < 2) {
      throw new DomainException('INVALID_ROLE_NAME', 'Nombre de rol invalido.');
    }

    return new RoleName(value.trim());
  }

  equals(other: RoleName): boolean {
    return this.value === other.value;
  }
}
