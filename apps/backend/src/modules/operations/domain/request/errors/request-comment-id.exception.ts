export class RequestCommentIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestCommentIdException';
  }
}
