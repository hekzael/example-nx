import { ProjectModule } from '@projects/domain/project/entity/project-module.entity';
import { ProjectNotFoundException } from '@projects/domain/project/errors/project-not-found.exception';
import { ProjectId } from '@projects/domain/project/value-objects/project-id.vo';
import { ProjectModuleCode } from '@projects/domain/project/value-objects/project-module-code.vo';
import { ProjectModuleDescription } from '@projects/domain/project/value-objects/project-module-description.vo';
import { ProjectModuleId } from '@projects/domain/project/value-objects/project-module-id.vo';
import { ProjectModuleName } from '@projects/domain/project/value-objects/project-module-name.vo';
import { ProjectRepositoryPort } from '@projects/domain/project/repository/project-repository.port';
import { IdGeneratorPort } from '@projects/application/shared/port/id-generator.port';
import { AddProjectModuleCommand } from '../command/add-project-module.command';
import { AddProjectModulePort } from '../port/add-project-module.port';

export class AddProjectModuleUseCase implements AddProjectModulePort {
  constructor(
    private readonly projectRepository: ProjectRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
  ) {}

  async execute(command: AddProjectModuleCommand): Promise<string> {
    const projectId = new ProjectId(command.projectId);
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundException();
    }

    const moduleId = new ProjectModuleId(this.idGeneratorPort.generate());
    const module = new ProjectModule(
      moduleId,
      new ProjectModuleCode(command.code),
      new ProjectModuleName(command.name),
      new ProjectModuleDescription(command.description ?? null),
    );

    project.addModule(module);
    await this.projectRepository.save(project);
    return moduleId.value;
  }
}
