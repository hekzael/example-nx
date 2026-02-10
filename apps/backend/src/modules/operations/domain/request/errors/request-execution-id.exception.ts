export class RequestExecutionIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestExecutionIdException';
  }
}
