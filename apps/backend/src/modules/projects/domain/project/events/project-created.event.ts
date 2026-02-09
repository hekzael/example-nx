export class ProjectCreatedEvent {
  constructor(
    readonly projectId: string,
    readonly code: string,
    readonly occurredAt: Date,
  ) {}
}
