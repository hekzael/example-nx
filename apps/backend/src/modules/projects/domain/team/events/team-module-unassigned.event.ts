export class TeamModuleUnassignedEvent {
  constructor(
    readonly teamId: string,
    readonly projectModuleId: string,
    readonly occurredAt: Date,
  ) {}
}
