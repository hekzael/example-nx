export class TeamCreatedEvent {
  constructor(
    readonly teamId: string,
    readonly projectId: string,
    readonly occurredAt: Date,
  ) {}
}
