export class RequestCreatedEvent {
  constructor(
    readonly requestId: string,
    readonly projectId: string,
    readonly environmentId: string,
    readonly moduleId: string | null,
    readonly toolId: string,
    readonly createdBy: string,
    readonly occurredAt: Date,
  ) {}
}
