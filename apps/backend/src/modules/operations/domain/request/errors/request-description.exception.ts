import { RequestException } from './request.exception';

export class RequestDescriptionException extends RequestException {
  constructor(message = 'Invalid request description') {
    super(message);
    this.name = 'RequestDescriptionException';
  }
}
