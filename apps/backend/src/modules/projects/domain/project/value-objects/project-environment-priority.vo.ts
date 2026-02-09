import { ProjectEnvironmentPriorityException } from '../errors/project-environment-priority.exception';

export class ProjectEnvironmentPriority {
  constructor(readonly value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new ProjectEnvironmentPriorityException(
        'Invalid project environment priority',
      );
    }
  }
}
