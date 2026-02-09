import { ProjectModuleCodeException } from '../errors/project-module-code.exception';

export class ProjectModuleCode {
  private static readonly CODE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  constructor(readonly value: string) {
    if (!value || value.length > 100) {
      throw new ProjectModuleCodeException('Invalid project module code');
    }
    if (!ProjectModuleCode.CODE_REGEX.test(value)) {
      throw new ProjectModuleCodeException('Invalid project module code format');
    }
  }
}
