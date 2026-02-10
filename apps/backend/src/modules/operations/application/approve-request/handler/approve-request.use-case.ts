import { ApproveRequestCommand } from '../command/approve-request.command';
import { ApproveRequestPort } from '../port/approve-request.port';
import { RequestApprovalId } from '@operations/domain/request/value-objects/request-approval-id.vo';
import { RequestId } from '@operations/domain/request/value-objects/request-id.vo';
import { UserId } from '@operations/domain/request/value-objects/user-id.vo';
import { RequestRepositoryPort } from '@operations/domain/request/repository/request-repository.port';
import { RequestNotFoundException } from '@operations/domain/request/errors/request-not-found.exception';
import { IdGeneratorPort } from '@operations/application/shared/port/id-generator.port';

export class ApproveRequestUseCase implements ApproveRequestPort {
  constructor(
    private readonly requestRepository: RequestRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
  ) {}

  async execute(command: ApproveRequestCommand): Promise<string> {
    const requestId = new RequestId(command.requestId);
    const request = await this.requestRepository.findById(requestId);
    if (!request) {
      throw new RequestNotFoundException();
    }

    request.approve({
      requestApprovalId: new RequestApprovalId(this.idGeneratorPort.generate()),
      approvedBy: new UserId(command.approvedBy),
      comment: command.comment ?? null,
      minApprovals: command.minApprovals,
    });

    await this.requestRepository.save(request);
    return request.getStatus().value;
  }
}
