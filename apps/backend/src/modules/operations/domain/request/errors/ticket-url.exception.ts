import { RequestException } from './request.exception';

export class TicketUrlException extends RequestException {
  constructor(message = 'Invalid ticket url') {
    super(message);
    this.name = 'TicketUrlException';
  }
}
