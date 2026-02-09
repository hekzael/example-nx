import { PasswordHashException } from '@identity/domain/user/errors/password-hash.exception';

export class PasswordHash {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0 || value.length > 255) {
      throw new PasswordHashException('Invalid password hash');
    }
  }
}
