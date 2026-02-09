export class UserException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserException';
  }
}
