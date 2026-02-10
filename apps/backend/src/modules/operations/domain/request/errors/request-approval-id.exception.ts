export class RequestApprovalIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestApprovalIdException';
  }
}
