import { ProjectEnvironmentCodeException } from '../errors/project-environment-code.exception';

export class ProjectEnvironmentCode {
  private static readonly CODE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  constructor(readonly value: string) {
    if (!value || value.length > 50) {
      throw new ProjectEnvironmentCodeException('Invalid project environment code');
    }
    if (!ProjectEnvironmentCode.CODE_REGEX.test(value)) {
      throw new ProjectEnvironmentCodeException('Invalid project environment code format');
    }
  }
}
