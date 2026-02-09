import { randomUUID } from 'crypto';
import { IdGeneratorPort } from '@projects/application/shared/port/id-generator.port';

export class CryptoIdGeneratorAdapter implements IdGeneratorPort {
  generate(): string {
    return randomUUID();
  }
}
