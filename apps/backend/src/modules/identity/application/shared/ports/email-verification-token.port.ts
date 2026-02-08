export interface EmailVerificationTokenPort {
  generate(userId: string): Promise<string>;
  verify(token: string): Promise<string | null>;
  invalidate(token: string): Promise<void>;
}
