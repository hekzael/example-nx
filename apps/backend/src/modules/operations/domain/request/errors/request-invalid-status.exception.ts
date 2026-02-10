import { RequestException } from './request.exception';

export class RequestInvalidStatusException extends RequestException {
  constructor(message = 'Invalid request status transition') {
    super(message);
    this.name = 'RequestInvalidStatusException';
  }
}
