import { DomainException } from './domain.exception';
import { ScopeTypeEnum } from './scope-type.enum';

export class Scope {
  private constructor(
    public readonly type: ScopeTypeEnum,
    public readonly id: string | null,
  ) {}

  static create(type: ScopeTypeEnum, id?: string | null): Scope {
    if (type === ScopeTypeEnum.Global) {
      return new Scope(type, null);
    }

    if (!id || id.trim().length === 0) {
      throw new DomainException('INVALID_SCOPE', 'ScopeId requerido.');
    }

    return new Scope(type, id);
  }

  equals(other: Scope): boolean {
    return this.type === other.type && this.id === other.id;
  }
}
