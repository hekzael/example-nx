import { randomUUID } from 'crypto';
import { UserIdGeneratorPort } from '../../../application/shared/port/user-id-generator.port';

export class CryptoUserIdGeneratorAdapter implements UserIdGeneratorPort {
  generate(): string {
    return randomUUID();
  }
}
