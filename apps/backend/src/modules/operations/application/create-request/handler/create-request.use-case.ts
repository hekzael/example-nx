import { CreateRequestCommand } from '../command/create-request.command';
import { CreateRequestPort } from '../port/create-request.port';
import { Request } from '@operations/domain/request/entity/request.entity';
import { ProjectEnvironmentId } from '@operations/domain/request/value-objects/project-environment-id.vo';
import { ProjectId } from '@operations/domain/request/value-objects/project-id.vo';
import { ProjectModuleId } from '@operations/domain/request/value-objects/project-module-id.vo';
import { RequestDescription } from '@operations/domain/request/value-objects/request-description.vo';
import { RequestId } from '@operations/domain/request/value-objects/request-id.vo';
import { RequestPayload } from '@operations/domain/request/value-objects/request-payload.vo';
import { RequestTitle } from '@operations/domain/request/value-objects/request-title.vo';
import { TicketUrl } from '@operations/domain/request/value-objects/ticket-url.vo';
import { ToolId } from '@operations/domain/request/value-objects/tool-id.vo';
import { UserId } from '@operations/domain/request/value-objects/user-id.vo';
import { RequestRepositoryPort } from '@operations/domain/request/repository/request-repository.port';
import { ToolNotEnabledException } from '@operations/domain/request/errors/tool-not-enabled.exception';
import { IdGeneratorPort } from '@operations/application/shared/port/id-generator.port';
import { ToolResolverPort } from '@operations/application/shared/port/tool-resolver.port';
import { RequestPayloadValidatorPort } from '@operations/application/shared/port/request-payload-validator.port';

export class CreateRequestUseCase implements CreateRequestPort {
  constructor(
    private readonly requestRepository: RequestRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
    private readonly toolResolverPort: ToolResolverPort,
    private readonly requestPayloadValidatorPort: RequestPayloadValidatorPort,
  ) {}

  async execute(command: CreateRequestCommand): Promise<string> {
    const projectId = new ProjectId(command.projectId);
    const projectEnvironmentId = new ProjectEnvironmentId(command.environmentId);
    const projectModuleId = command.moduleId
      ? new ProjectModuleId(command.moduleId)
      : null;
    const toolId = new ToolId(command.toolId);
    const createdBy = new UserId(command.createdBy);

    const isToolEnabled = await this.toolResolverPort.isToolEnabled(projectId, toolId);
    if (!isToolEnabled) {
      throw new ToolNotEnabledException();
    }

    await this.requestPayloadValidatorPort.validate(toolId, command.payload);

    const requestId = new RequestId(this.idGeneratorPort.generate());
    const request = Request.createNew({
      requestId,
      projectId,
      projectEnvironmentId,
      projectModuleId,
      toolId,
      title: new RequestTitle(command.title),
      description: new RequestDescription(command.description ?? null),
      ticketUrl: new TicketUrl(command.urlTicket),
      payload: new RequestPayload(command.payload),
      createdBy,
    });

    await this.requestRepository.save(request);
    return requestId.value;
  }
}
