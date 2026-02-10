export class RequestApprovedEvent {
  constructor(
    readonly requestId: string,
    readonly approvedBy: string,
    readonly occurredAt: Date,
  ) {}
}
