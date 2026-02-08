export interface PasswordResetTokenPort {
  generate(userId: string): Promise<string>;
  verify(token: string): Promise<string | null>;
  invalidate(token: string): Promise<void>;
}
