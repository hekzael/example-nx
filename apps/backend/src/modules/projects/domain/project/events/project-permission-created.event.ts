export class ProjectPermissionCreatedEvent {
  constructor(
    readonly projectId: string,
    readonly projectPermissionId: string,
    readonly occurredAt: Date,
  ) {}
}
