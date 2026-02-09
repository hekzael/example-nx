import { UserException } from '@identity/domain/user/errors/user.exception';

export class PasswordPolicyService {
  private static readonly MIN_LENGTH = 12;
  private static readonly HAS_UPPERCASE = /[A-Z]/;
  private static readonly HAS_LOWERCASE = /[a-z]/;
  private static readonly HAS_NUMBER = /[0-9]/;

  static validate(password: string): void {
    if (!password || password.length < PasswordPolicyService.MIN_LENGTH) {
      throw new UserException('Password does not meet policy requirements');
    }
    if (!PasswordPolicyService.HAS_UPPERCASE.test(password)) {
      throw new UserException('Password does not meet policy requirements');
    }
    if (!PasswordPolicyService.HAS_LOWERCASE.test(password)) {
      throw new UserException('Password does not meet policy requirements');
    }
    if (!PasswordPolicyService.HAS_NUMBER.test(password)) {
      throw new UserException('Password does not meet policy requirements');
    }
  }
}
