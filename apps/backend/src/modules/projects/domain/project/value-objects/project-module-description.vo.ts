import { ProjectModuleDescriptionException } from '../errors/project-module-description.exception';

export class ProjectModuleDescription {
  constructor(readonly value: string | null) {
    if (value === null || value === undefined) {
      return;
    }
    if (value.length > 1000) {
      throw new ProjectModuleDescriptionException('Invalid project module description');
    }
  }
}
