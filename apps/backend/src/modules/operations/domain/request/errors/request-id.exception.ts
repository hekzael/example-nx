export class RequestIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestIdException';
  }
}
