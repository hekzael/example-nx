import { RequestException } from '../errors/request.exception';

export class RequestPayload {
  constructor(readonly value: unknown) {
    if (value === undefined || value === null) {
      throw new RequestException('Request payload is required');
    }
  }
}
