import { PasswordHashingPort } from '../../application/shared/ports/password-hashing.port';

export class InMemoryPasswordHashingAdapter implements PasswordHashingPort {
  async hash(plain: string): Promise<string> {
    return `hash:${plain}`;
  }

  async verify(plain: string, hash: string): Promise<boolean> {
    return hash === `hash:${plain}`;
  }
}
