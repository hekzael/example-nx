import { Project } from '@projects/domain/project/entity/project.entity';
import { ProjectAlreadyExistsException } from '@projects/domain/project/errors/project-already-exists.exception';
import { ProjectCode } from '@projects/domain/project/value-objects/project-code.vo';
import { ProjectDescription } from '@projects/domain/project/value-objects/project-description.vo';
import { ProjectId } from '@projects/domain/project/value-objects/project-id.vo';
import { ProjectName } from '@projects/domain/project/value-objects/project-name.vo';
import { ProjectRepositoryPort } from '@projects/domain/project/repository/project-repository.port';
import { CreateProjectCommand } from '../command/create-project.command';
import { CreateProjectPort } from '../port/create-project.port';
import { IdGeneratorPort } from '@projects/application/shared/port/id-generator.port';

export class CreateProjectUseCase implements CreateProjectPort {
  constructor(
    private readonly projectRepository: ProjectRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
  ) {}

  async execute(command: CreateProjectCommand): Promise<string> {
    const code = new ProjectCode(command.code);
    const name = new ProjectName(command.name);
    const description = new ProjectDescription(command.description ?? null);

    const exists = await this.projectRepository.existsByCode(code);
    if (exists) {
      throw new ProjectAlreadyExistsException();
    }

    const projectId = new ProjectId(this.idGeneratorPort.generate());
    const project = Project.createNew({
      projectId,
      code,
      name,
      description,
    });

    await this.projectRepository.save(project);
    return projectId.value;
  }
}
