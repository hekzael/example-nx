import { Repository } from 'typeorm';
import { ToolResolverPort } from '@operations/application/shared/port/tool-resolver.port';
import { ProjectId } from '@operations/domain/request/value-objects/project-id.vo';
import { ToolId } from '@operations/domain/request/value-objects/tool-id.vo';
import { ProjectToolOrmEntity } from '@operations/infrastructure/persistence/typeorm/entities/project-tool.orm-entity';

export class TypeOrmToolResolverAdapter implements ToolResolverPort {
  constructor(
    private readonly projectToolRepository: Repository<ProjectToolOrmEntity>,
  ) {}

  async isToolEnabled(projectId: ProjectId, toolId: ToolId): Promise<boolean> {
    const result = await this.projectToolRepository.findOne({
      where: {
        projectId: projectId.value,
        toolId: toolId.value,
        isEnabled: true,
      },
    });

    return !!result;
  }
}
