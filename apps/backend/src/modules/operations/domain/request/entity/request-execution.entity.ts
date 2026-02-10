import { ExecutionStatus } from '../value-objects/execution-status.vo';
import { RequestExecutionId } from '../value-objects/request-execution-id.vo';
import { UserId } from '../value-objects/user-id.vo';

export class RequestExecution {
  private constructor(
    readonly requestExecutionId: RequestExecutionId,
    readonly executedBy: UserId | null,
    readonly status: ExecutionStatus,
    readonly outputRef: string | null,
    readonly startedAt: Date,
    readonly finishedAt: Date,
  ) {}

  static create(params: {
    requestExecutionId: RequestExecutionId;
    executedBy: UserId | null;
    status: ExecutionStatus;
    outputRef: string | null;
    startedAt?: Date;
    finishedAt?: Date;
  }): RequestExecution {
    const startedAt = params.startedAt ?? new Date();
    const finishedAt = params.finishedAt ?? startedAt;
    return new RequestExecution(
      params.requestExecutionId,
      params.executedBy,
      params.status,
      params.outputRef ?? null,
      startedAt,
      finishedAt,
    );
  }
}
