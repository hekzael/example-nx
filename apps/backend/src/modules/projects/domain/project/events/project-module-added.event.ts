export class ProjectModuleAddedEvent {
  constructor(
    readonly projectId: string,
    readonly projectModuleId: string,
    readonly occurredAt: Date,
  ) {}
}
