import { ProjectEnvironmentDescriptionException } from '../errors/project-environment-description.exception';

export class ProjectEnvironmentDescription {
  constructor(readonly value: string | null) {
    if (value === null || value === undefined) {
      return;
    }
    if (value.length > 1000) {
      throw new ProjectEnvironmentDescriptionException(
        'Invalid project environment description',
      );
    }
  }
}
