import { RequestCommentId } from '../value-objects/request-comment-id.vo';
import { UserId } from '../value-objects/user-id.vo';

export class RequestComment {
  private constructor(
    readonly requestCommentId: RequestCommentId,
    readonly body: string,
    readonly createdBy: UserId,
    readonly createdAt: Date,
  ) {}

  static create(params: {
    requestCommentId: RequestCommentId;
    body: string;
    createdBy: UserId;
    createdAt?: Date;
  }): RequestComment {
    return new RequestComment(
      params.requestCommentId,
      params.body,
      params.createdBy,
      params.createdAt ?? new Date(),
    );
  }
}
