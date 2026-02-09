export class InvalidValidityPeriodException extends Error {
  constructor(message = 'Invalid validity period') {
    super(message);
    this.name = 'InvalidValidityPeriodException';
  }
}
