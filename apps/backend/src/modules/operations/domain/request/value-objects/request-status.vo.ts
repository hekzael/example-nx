import { RequestStatusException } from '../errors/request-status.exception';

export class RequestStatus {
  private static readonly ALLOWED = [
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'EXECUTING',
    'EXECUTED',
    'FAILED',
    'CANCELLED',
  ] as const;

  constructor(readonly value: string) {
    if (!RequestStatus.ALLOWED.includes(value as typeof RequestStatus.ALLOWED[number])) {
      throw new RequestStatusException('Invalid request status');
    }
  }
}
