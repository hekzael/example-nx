import { DomainException } from './domain.exception';

export class TimeRange {
  private constructor(
    public readonly from: Date,
    public readonly to: Date | null,
  ) {}

  static create(from: Date, to?: Date | null): TimeRange {
    if (!(from instanceof Date) || Number.isNaN(from.getTime())) {
      throw new DomainException('INVALID_TIME_RANGE', 'From invalido.');
    }

    if (to) {
      if (!(to instanceof Date) || Number.isNaN(to.getTime())) {
        throw new DomainException('INVALID_TIME_RANGE', 'To invalido.');
      }

      if (from.getTime() >= to.getTime()) {
        throw new DomainException('INVALID_TIME_RANGE', 'From debe ser menor a To.');
      }
    }

    return new TimeRange(from, to ?? null);
  }

  contains(at: Date): boolean {
    if (!(at instanceof Date) || Number.isNaN(at.getTime())) {
      throw new DomainException('INVALID_TIME_RANGE', 'Timestamp invalido.');
    }

    if (this.to) {
      return this.from.getTime() <= at.getTime() && at.getTime() <= this.to.getTime();
    }

    return this.from.getTime() <= at.getTime();
  }
}
