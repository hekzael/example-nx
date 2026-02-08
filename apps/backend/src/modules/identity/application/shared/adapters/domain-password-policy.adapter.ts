import { PasswordPolicyService } from '../../../domain/shared/services/password-policy.service';
import { PasswordPolicyPort } from '../ports/password-policy.port';

export class DomainPasswordPolicyAdapter implements PasswordPolicyPort {
  private readonly policy = new PasswordPolicyService();

  validate(plain: string): void {
    this.policy.validate(plain);
  }
}
