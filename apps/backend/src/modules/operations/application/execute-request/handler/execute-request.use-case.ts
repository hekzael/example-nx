import { ExecuteRequestCommand } from '../command/execute-request.command';
import { ExecuteRequestPort } from '../port/execute-request.port';
import { ExecutionStatus } from '@operations/domain/request/value-objects/execution-status.vo';
import { RequestExecutionId } from '@operations/domain/request/value-objects/request-execution-id.vo';
import { RequestId } from '@operations/domain/request/value-objects/request-id.vo';
import { UserId } from '@operations/domain/request/value-objects/user-id.vo';
import { RequestRepositoryPort } from '@operations/domain/request/repository/request-repository.port';
import { RequestNotFoundException } from '@operations/domain/request/errors/request-not-found.exception';
import { IdGeneratorPort } from '@operations/application/shared/port/id-generator.port';

export class ExecuteRequestUseCase implements ExecuteRequestPort {
  constructor(
    private readonly requestRepository: RequestRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
  ) {}

  async execute(command: ExecuteRequestCommand): Promise<string> {
    const requestId = new RequestId(command.requestId);
    const request = await this.requestRepository.findById(requestId);
    if (!request) {
      throw new RequestNotFoundException();
    }

    request.execute({
      requestExecutionId: new RequestExecutionId(this.idGeneratorPort.generate()),
      executedBy: command.executedBy ? new UserId(command.executedBy) : null,
      status: new ExecutionStatus(command.status),
      outputRef: command.outputRef ?? null,
    });

    await this.requestRepository.save(request);
    return request.getStatus().value;
  }
}
