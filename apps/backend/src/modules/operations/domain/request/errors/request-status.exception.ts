import { RequestException } from './request.exception';

export class RequestStatusException extends RequestException {
  constructor(message = 'Invalid request status') {
    super(message);
    this.name = 'RequestStatusException';
  }
}
