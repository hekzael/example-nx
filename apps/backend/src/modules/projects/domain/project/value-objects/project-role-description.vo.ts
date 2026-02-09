import { ProjectRoleDescriptionException } from '../errors/project-role-description.exception';

export class ProjectRoleDescription {
  constructor(readonly value: string | null) {
    if (value === null || value === undefined) {
      return;
    }
    if (value.length > 1000) {
      throw new ProjectRoleDescriptionException('Invalid project role description');
    }
  }
}
