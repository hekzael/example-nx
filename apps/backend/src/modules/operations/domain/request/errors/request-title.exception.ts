import { RequestException } from './request.exception';

export class RequestTitleException extends RequestException {
  constructor(message = 'Invalid request title') {
    super(message);
    this.name = 'RequestTitleException';
  }
}
