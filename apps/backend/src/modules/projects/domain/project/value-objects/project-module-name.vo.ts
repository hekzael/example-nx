import { ProjectModuleNameException } from '../errors/project-module-name.exception';

export class ProjectModuleName {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0 || value.length > 255) {
      throw new ProjectModuleNameException('Invalid project module name');
    }
  }
}
