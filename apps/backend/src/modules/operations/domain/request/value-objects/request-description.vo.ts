import { RequestDescriptionException } from '../errors/request-description.exception';

export class RequestDescription {
  constructor(readonly value: string | null) {
    if (value !== null && value.length > 500) {
      throw new RequestDescriptionException('Invalid request description');
    }
  }
}
