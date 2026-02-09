import { ProjectEnvironmentNameException } from '../errors/project-environment-name.exception';

export class ProjectEnvironmentName {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0 || value.length > 255) {
      throw new ProjectEnvironmentNameException('Invalid project environment name');
    }
  }
}
