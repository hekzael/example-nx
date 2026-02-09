export class CreateProjectCommand {
  constructor(
    readonly code: string,
    readonly name: string,
    readonly description?: string | null,
  ) {}
}
