import { InvalidValidityPeriodException } from '../errors/invalid-validity-period.exception';

export class ValidityPeriod {
  constructor(
    readonly validFrom: Date,
    readonly validUntil: Date | null,
  ) {
    if (!validFrom) {
      throw new InvalidValidityPeriodException('validFrom is required');
    }
    if (validUntil && validUntil <= validFrom) {
      throw new InvalidValidityPeriodException('validUntil must be after validFrom');
    }
  }
}
