export class CommentRequestCommand {
  constructor(
    readonly requestId: string,
    readonly body: string,
    readonly createdBy: string,
  ) {}
}
