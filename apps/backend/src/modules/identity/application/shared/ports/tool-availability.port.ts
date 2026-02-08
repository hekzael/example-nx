export interface ToolAvailabilityPort {
  isToolEnabledForProject(toolId: string, projectId: string): Promise<boolean>;
}
