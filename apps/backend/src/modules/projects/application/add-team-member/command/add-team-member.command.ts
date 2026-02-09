export class AddTeamMemberCommand {
  constructor(
    readonly teamId: string,
    readonly userId: string,
    readonly role: string,
    readonly validFrom: Date,
    readonly validUntil: Date | null,
  ) {}
}
