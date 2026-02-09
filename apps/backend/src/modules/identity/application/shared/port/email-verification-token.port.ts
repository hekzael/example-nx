export interface EmailVerificationTokenPort {
  create(userId: string): Promise<string>;
  consume(token: string): Promise<string | null>;
}
