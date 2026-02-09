import { PermissionAction } from '../value-objects/permission-action.vo';
import { ProjectEnvironmentId } from '../value-objects/project-environment-id.vo';
import { ProjectModuleId } from '../value-objects/project-module-id.vo';
import { ProjectPermissionId } from '../value-objects/project-permission-id.vo';

export class ProjectPermission {
  constructor(
    readonly projectPermissionId: ProjectPermissionId,
    readonly action: PermissionAction,
    readonly projectModuleId: ProjectModuleId | null,
    readonly projectEnvironmentId: ProjectEnvironmentId | null,
  ) {}
}
