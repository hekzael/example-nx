export class ProjectEnvironmentAddedEvent {
  constructor(
    readonly projectId: string,
    readonly projectEnvironmentId: string,
    readonly occurredAt: Date,
  ) {}
}
