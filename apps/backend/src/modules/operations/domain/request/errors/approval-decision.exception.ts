import { RequestException } from './request.exception';

export class ApprovalDecisionException extends RequestException {
  constructor(message = 'Invalid approval decision') {
    super(message);
    this.name = 'ApprovalDecisionException';
  }
}
