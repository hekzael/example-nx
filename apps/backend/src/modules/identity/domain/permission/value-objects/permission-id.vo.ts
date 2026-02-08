import { DomainException } from '../../shared/domain.exception';

export class PermissionId {
  private constructor(public readonly value: string) {}

  static create(value: string): PermissionId {
    if (!value || value.trim().length === 0) {
      throw new DomainException('INVALID_PERMISSION_ID', 'PermissionId invalido.');
    }

    return new PermissionId(value);
  }

  equals(other: PermissionId): boolean {
    return this.value === other.value;
  }
}
