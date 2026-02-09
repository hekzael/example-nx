import { ProjectCodeException } from '../errors/project-code.exception';

export class ProjectCode {
  private static readonly CODE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  constructor(readonly value: string) {
    if (!value || value.length > 100) {
      throw new ProjectCodeException('Invalid project code');
    }
    if (!ProjectCode.CODE_REGEX.test(value)) {
      throw new ProjectCodeException('Invalid project code format');
    }
  }
}
