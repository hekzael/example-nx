import { ProjectRoleDescription } from '../value-objects/project-role-description.vo';
import { ProjectRoleId } from '../value-objects/project-role-id.vo';
import { ProjectRoleName } from '../value-objects/project-role-name.vo';

export class ProjectRole {
  constructor(
    readonly projectRoleId: ProjectRoleId,
    readonly name: ProjectRoleName,
    readonly description: ProjectRoleDescription,
  ) {}
}
