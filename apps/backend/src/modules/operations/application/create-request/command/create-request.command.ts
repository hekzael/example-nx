export class CreateRequestCommand {
  constructor(
    readonly projectId: string,
    readonly environmentId: string,
    readonly moduleId: string | null,
    readonly toolId: string,
    readonly title: string,
    readonly description: string | null,
    readonly urlTicket: string,
    readonly payload: unknown,
    readonly createdBy: string,
  ) {}
}
