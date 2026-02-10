import { ExecutionStatusException } from '../errors/execution-status.exception';

export class ExecutionStatus {
  private static readonly ALLOWED = ['SUCCESS', 'FAILED'] as const;

  constructor(readonly value: string) {
    if (!ExecutionStatus.ALLOWED.includes(value as typeof ExecutionStatus.ALLOWED[number])) {
      throw new ExecutionStatusException('Invalid execution status');
    }
  }
}
