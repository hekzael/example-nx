export class AddProjectModuleCommand {
  constructor(
    readonly projectId: string,
    readonly code: string,
    readonly name: string,
    readonly description?: string | null,
  ) {}
}
