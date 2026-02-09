import { Repository } from 'typeorm';
import { ToolAvailabilityPort } from '../../../application/shared/ports/tool-availability.port';
import { TypeormProjectToolEntity } from '../../persistence/typeorm/entities/typeorm-project-tool.entity';

export class TypeormToolAvailabilityAdapter implements ToolAvailabilityPort {
  constructor(
    private readonly projectToolRepository: Repository<TypeormProjectToolEntity>,
  ) {}

  async isToolEnabledForProject(
    toolId: string,
    projectId: string,
  ): Promise<boolean> {
    const record = await this.projectToolRepository.findOne({
      where: { projectId, toolId },
    });

    return Boolean(record);
  }
}
