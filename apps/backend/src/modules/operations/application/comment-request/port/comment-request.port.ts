import { CommentRequestCommand } from '@operations/application/comment-request/command/comment-request.command';

export interface CommentRequestPort {
  execute(command: CommentRequestCommand): Promise<string>;
}
