import { DomainException } from '../../shared/domain.exception';

const PERMISSION_KEY_REGEX = /^[a-z]+(\.[a-z-]+)+$/;

export class PermissionKey {
  private constructor(public readonly value: string) {}

  static create(value: string): PermissionKey {
    if (!value || !PERMISSION_KEY_REGEX.test(value)) {
      throw new DomainException('INVALID_PERMISSION_KEY', 'Permission key invalido.');
    }

    return new PermissionKey(value);
  }

  equals(other: PermissionKey): boolean {
    return this.value === other.value;
  }
}
