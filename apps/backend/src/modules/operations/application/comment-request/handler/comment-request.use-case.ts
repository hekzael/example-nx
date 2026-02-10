import { CommentRequestCommand } from '../command/comment-request.command';
import { CommentRequestPort } from '../port/comment-request.port';
import { RequestCommentId } from '@operations/domain/request/value-objects/request-comment-id.vo';
import { RequestId } from '@operations/domain/request/value-objects/request-id.vo';
import { UserId } from '@operations/domain/request/value-objects/user-id.vo';
import { RequestRepositoryPort } from '@operations/domain/request/repository/request-repository.port';
import { RequestNotFoundException } from '@operations/domain/request/errors/request-not-found.exception';
import { IdGeneratorPort } from '@operations/application/shared/port/id-generator.port';

export class CommentRequestUseCase implements CommentRequestPort {
  constructor(
    private readonly requestRepository: RequestRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
  ) {}

  async execute(command: CommentRequestCommand): Promise<string> {
    const requestId = new RequestId(command.requestId);
    const request = await this.requestRepository.findById(requestId);
    if (!request) {
      throw new RequestNotFoundException();
    }

    request.comment({
      requestCommentId: new RequestCommentId(this.idGeneratorPort.generate()),
      body: command.body,
      createdBy: new UserId(command.createdBy),
    });

    await this.requestRepository.save(request);
    return request.getRequestId().value;
  }
}
