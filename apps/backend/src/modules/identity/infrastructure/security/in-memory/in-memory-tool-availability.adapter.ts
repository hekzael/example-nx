import { ToolAvailabilityPort } from '../../application/shared/ports/tool-availability.port';

export class InMemoryToolAvailabilityAdapter implements ToolAvailabilityPort {
  private readonly projectTools = new Map<string, Set<string>>();

  async isToolEnabledForProject(toolId: string, projectId: string): Promise<boolean> {
    const tools = this.projectTools.get(projectId);
    if (!tools) {
      return false;
    }

    return tools.has(toolId);
  }
}
