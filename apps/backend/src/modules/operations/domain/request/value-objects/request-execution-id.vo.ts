import { RequestExecutionIdException } from '../errors/request-execution-id.exception';

export class RequestExecutionId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(readonly value: string) {
    if (!value || !RequestExecutionId.UUID_REGEX.test(value)) {
      throw new RequestExecutionIdException('Invalid request execution id');
    }
  }
}
