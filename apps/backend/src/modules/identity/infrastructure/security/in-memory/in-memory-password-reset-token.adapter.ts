import { PasswordResetTokenPort } from '../../application/shared/ports/password-reset-token.port';

type TokenRecord = {
  userId: string;
  expiresAt: number;
};

const TTL_MS = 30 * 60 * 1000;

export class InMemoryPasswordResetTokenAdapter implements PasswordResetTokenPort {
  private readonly tokens = new Map<string, TokenRecord>();

  async generate(userId: string): Promise<string> {
    const token = `reset_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    this.tokens.set(token, { userId, expiresAt: Date.now() + TTL_MS });
    return token;
  }

  async verify(token: string): Promise<string | null> {
    const record = this.tokens.get(token);
    if (!record) {
      return null;
    }

    if (Date.now() > record.expiresAt) {
      this.tokens.delete(token);
      return null;
    }

    return record.userId;
  }

  async invalidate(token: string): Promise<void> {
    this.tokens.delete(token);
  }
}
