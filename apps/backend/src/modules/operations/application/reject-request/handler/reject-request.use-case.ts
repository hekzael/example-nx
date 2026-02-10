import { RejectRequestCommand } from '../command/reject-request.command';
import { RejectRequestPort } from '../port/reject-request.port';
import { RequestApprovalId } from '@operations/domain/request/value-objects/request-approval-id.vo';
import { RequestId } from '@operations/domain/request/value-objects/request-id.vo';
import { UserId } from '@operations/domain/request/value-objects/user-id.vo';
import { RequestRepositoryPort } from '@operations/domain/request/repository/request-repository.port';
import { RequestNotFoundException } from '@operations/domain/request/errors/request-not-found.exception';
import { IdGeneratorPort } from '@operations/application/shared/port/id-generator.port';

export class RejectRequestUseCase implements RejectRequestPort {
  constructor(
    private readonly requestRepository: RequestRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
  ) {}

  async execute(command: RejectRequestCommand): Promise<string> {
    const requestId = new RequestId(command.requestId);
    const request = await this.requestRepository.findById(requestId);
    if (!request) {
      throw new RequestNotFoundException();
    }

    request.reject({
      requestApprovalId: new RequestApprovalId(this.idGeneratorPort.generate()),
      rejectedBy: new UserId(command.rejectedBy),
      comment: command.comment ?? null,
    });

    await this.requestRepository.save(request);
    return request.getStatus().value;
  }
}
