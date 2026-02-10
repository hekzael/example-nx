export class RequestExecutedEvent {
  constructor(
    readonly requestId: string,
    readonly executedBy: string | null,
    readonly status: string,
    readonly outputRef: string | null,
    readonly occurredAt: Date,
  ) {}
}
