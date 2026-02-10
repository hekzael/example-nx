import { TicketUrlException } from '../errors/ticket-url.exception';

export class TicketUrl {
  constructor(readonly value: string) {
    if (!value || value.length > 200) {
      throw new TicketUrlException('Invalid ticket url');
    }
    try {
      new URL(value);
    } catch {
      throw new TicketUrlException('Invalid ticket url format');
    }
  }
}
