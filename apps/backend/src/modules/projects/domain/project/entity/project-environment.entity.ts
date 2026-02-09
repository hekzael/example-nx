import { ProjectEnvironmentCode } from '../value-objects/project-environment-code.vo';
import { ProjectEnvironmentDescription } from '../value-objects/project-environment-description.vo';
import { ProjectEnvironmentId } from '../value-objects/project-environment-id.vo';
import { ProjectEnvironmentName } from '../value-objects/project-environment-name.vo';
import { ProjectEnvironmentPriority } from '../value-objects/project-environment-priority.vo';

export class ProjectEnvironment {
  constructor(
    readonly projectEnvironmentId: ProjectEnvironmentId,
    readonly code: ProjectEnvironmentCode,
    readonly name: ProjectEnvironmentName,
    readonly description: ProjectEnvironmentDescription,
    readonly priority: ProjectEnvironmentPriority,
  ) {}
}
