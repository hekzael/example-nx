import { DomainException } from '../domain.exception';

export class PasswordPolicyService {
  validate(plain: string): void {
    if (!plain || plain.length < 12) {
      throw new DomainException('PASSWORD_TOO_SHORT', 'Password debe tener al menos 12 caracteres.');
    }

    if (!/[A-Z]/.test(plain)) {
      throw new DomainException('PASSWORD_WEAK', 'Password requiere al menos una mayuscula.');
    }

    if (!/[a-z]/.test(plain)) {
      throw new DomainException('PASSWORD_WEAK', 'Password requiere al menos una minuscula.');
    }

    if (!/\d/.test(plain)) {
      throw new DomainException('PASSWORD_WEAK', 'Password requiere al menos un numero.');
    }
  }
}
