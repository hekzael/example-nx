import { ProjectEnvironment } from '@projects/domain/project/entity/project-environment.entity';
import { ProjectNotFoundException } from '@projects/domain/project/errors/project-not-found.exception';
import { ProjectEnvironmentCode } from '@projects/domain/project/value-objects/project-environment-code.vo';
import { ProjectEnvironmentDescription } from '@projects/domain/project/value-objects/project-environment-description.vo';
import { ProjectEnvironmentId } from '@projects/domain/project/value-objects/project-environment-id.vo';
import { ProjectEnvironmentName } from '@projects/domain/project/value-objects/project-environment-name.vo';
import { ProjectEnvironmentPriority } from '@projects/domain/project/value-objects/project-environment-priority.vo';
import { ProjectId } from '@projects/domain/project/value-objects/project-id.vo';
import { ProjectRepositoryPort } from '@projects/domain/project/repository/project-repository.port';
import { IdGeneratorPort } from '@projects/application/shared/port/id-generator.port';
import { AddProjectEnvironmentCommand } from '../command/add-project-environment.command';
import { AddProjectEnvironmentPort } from '../port/add-project-environment.port';

export class AddProjectEnvironmentUseCase implements AddProjectEnvironmentPort {
  constructor(
    private readonly projectRepository: ProjectRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
  ) {}

  async execute(command: AddProjectEnvironmentCommand): Promise<string> {
    const projectId = new ProjectId(command.projectId);
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundException();
    }

    const environmentId = new ProjectEnvironmentId(
      this.idGeneratorPort.generate(),
    );
    const environment = new ProjectEnvironment(
      environmentId,
      new ProjectEnvironmentCode(command.code),
      new ProjectEnvironmentName(command.name),
      new ProjectEnvironmentDescription(command.description ?? null),
      new ProjectEnvironmentPriority(command.priority),
    );

    project.addEnvironment(environment);
    await this.projectRepository.save(project);
    return environmentId.value;
  }
}
