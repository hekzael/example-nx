export class ProjectRoleCreatedEvent {
  constructor(
    readonly projectId: string,
    readonly projectRoleId: string,
    readonly occurredAt: Date,
  ) {}
}
