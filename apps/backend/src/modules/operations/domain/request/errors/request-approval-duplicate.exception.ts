import { RequestException } from './request.exception';

export class RequestApprovalDuplicateException extends RequestException {
  constructor(message = 'Request approval already exists for this user') {
    super(message);
    this.name = 'RequestApprovalDuplicateException';
  }
}
