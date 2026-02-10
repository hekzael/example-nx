export class ExecuteRequestCommand {
  constructor(
    readonly requestId: string,
    readonly executedBy: string | null,
    readonly status: 'SUCCESS' | 'FAILED',
    readonly outputRef: string | null,
  ) {}
}
