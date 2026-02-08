export interface PasswordPolicyPort {
  validate(plain: string): void;
}
