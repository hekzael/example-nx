import { ProjectId } from '@operations/domain/request/value-objects/project-id.vo';
import { ToolId } from '@operations/domain/request/value-objects/tool-id.vo';
import { ToolResolverPort } from '@operations/application/shared/port/tool-resolver.port';

export class AllowAllToolResolverAdapter implements ToolResolverPort {
  async isToolEnabled(projectId: ProjectId, toolId: ToolId): Promise<boolean> {
    void projectId;
    void toolId;
    return true;
  }
}
