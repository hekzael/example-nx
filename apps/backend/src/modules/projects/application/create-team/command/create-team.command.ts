export class CreateTeamCommand {
  constructor(
    readonly projectId: string,
    readonly name: string,
    readonly description?: string | null,
  ) {}
}
