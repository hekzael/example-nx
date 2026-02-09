import { ProjectRoleNameException } from '../errors/project-role-name.exception';

export class ProjectRoleName {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0 || value.length > 255) {
      throw new ProjectRoleNameException('Invalid project role name');
    }
  }
}
