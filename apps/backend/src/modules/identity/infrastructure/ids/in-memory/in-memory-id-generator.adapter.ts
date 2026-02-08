import { IdGeneratorPort } from '../../application/shared/ports/id-generator.port';

export class InMemoryIdGeneratorAdapter implements IdGeneratorPort {
  private counter = 0;

  nextId(): string {
    this.counter += 1;
    return `id_${Date.now()}_${this.counter}`;
  }
}
