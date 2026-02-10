export class RequestRejectedEvent {
  constructor(
    readonly requestId: string,
    readonly rejectedBy: string,
    readonly occurredAt: Date,
  ) {}
}
