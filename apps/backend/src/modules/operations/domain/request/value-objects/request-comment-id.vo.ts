import { RequestCommentIdException } from '../errors/request-comment-id.exception';

export class RequestCommentId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(readonly value: string) {
    if (!value || !RequestCommentId.UUID_REGEX.test(value)) {
      throw new RequestCommentIdException('Invalid request comment id');
    }
  }
}
