export class TeamMemberRemovedEvent {
  constructor(
    readonly teamId: string,
    readonly teamMemberId: string,
    readonly occurredAt: Date,
  ) {}
}
