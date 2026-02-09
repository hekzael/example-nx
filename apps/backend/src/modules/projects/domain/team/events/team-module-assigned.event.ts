export class TeamModuleAssignedEvent {
  constructor(
    readonly teamId: string,
    readonly projectModuleId: string,
    readonly occurredAt: Date,
  ) {}
}
