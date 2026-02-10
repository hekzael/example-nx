export class ApproveRequestCommand {
  constructor(
    readonly requestId: string,
    readonly approvedBy: string,
    readonly comment: string | null,
    readonly minApprovals: number,
  ) {}
}
