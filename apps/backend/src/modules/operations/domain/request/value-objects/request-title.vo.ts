import { RequestTitleException } from '../errors/request-title.exception';

export class RequestTitle {
  constructor(readonly value: string) {
    if (!value || value.length < 3 || value.length > 120) {
      throw new RequestTitleException('Invalid request title');
    }
  }
}
