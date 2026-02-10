import { ProjectId } from '@operations/domain/request/value-objects/project-id.vo';
import { ToolId } from '@operations/domain/request/value-objects/tool-id.vo';

export interface ToolResolverPort {
  isToolEnabled(projectId: ProjectId, toolId: ToolId): Promise<boolean>;
}
