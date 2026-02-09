import { ProjectDescriptionException } from '../errors/project-description.exception';

export class ProjectDescription {
  constructor(readonly value: string | null) {
    if (value === null || value === undefined) {
      return;
    }
    if (value.length > 1000) {
      throw new ProjectDescriptionException('Invalid project description');
    }
  }
}
