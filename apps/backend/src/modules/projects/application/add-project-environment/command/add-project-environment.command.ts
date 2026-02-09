export class AddProjectEnvironmentCommand {
  constructor(
    readonly projectId: string,
    readonly code: string,
    readonly name: string,
    readonly description: string | null,
    readonly priority: number,
  ) {}
}
