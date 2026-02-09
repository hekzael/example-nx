export class PasswordHashException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordHashException';
  }
}
