export class RejectRequestCommand {
  constructor(
    readonly requestId: string,
    readonly rejectedBy: string,
    readonly comment: string | null,
  ) {}
}
