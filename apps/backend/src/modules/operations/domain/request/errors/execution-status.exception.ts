import { RequestException } from './request.exception';

export class ExecutionStatusException extends RequestException {
  constructor(message = 'Invalid execution status') {
    super(message);
    this.name = 'ExecutionStatusException';
  }
}
