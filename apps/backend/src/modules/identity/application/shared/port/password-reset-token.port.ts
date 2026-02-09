export interface PasswordResetTokenPort {
  create(userId: string): Promise<string>;
  consume(token: string): Promise<string | null>;
}
