import { ProjectNameException } from '../errors/project-name.exception';

export class ProjectName {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0 || value.length > 255) {
      throw new ProjectNameException('Invalid project name');
    }
  }
}
