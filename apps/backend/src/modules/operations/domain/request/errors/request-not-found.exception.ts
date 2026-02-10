import { RequestException } from './request.exception';

export class RequestNotFoundException extends RequestException {
  constructor(message = 'Request not found') {
    super(message);
    this.name = 'RequestNotFoundException';
  }
}
