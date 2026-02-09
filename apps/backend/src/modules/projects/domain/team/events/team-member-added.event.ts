export class TeamMemberAddedEvent {
  constructor(
    readonly teamId: string,
    readonly teamMemberId: string,
    readonly occurredAt: Date,
  ) {}
}
