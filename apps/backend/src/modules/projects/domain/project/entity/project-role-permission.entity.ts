import { ProjectPermissionId } from '../value-objects/project-permission-id.vo';
import { ProjectRoleId } from '../value-objects/project-role-id.vo';

export class ProjectRolePermission {
  constructor(
    readonly projectRoleId: ProjectRoleId,
    readonly projectPermissionId: ProjectPermissionId,
  ) {}
}
