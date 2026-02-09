import { ProjectModuleCode } from '../value-objects/project-module-code.vo';
import { ProjectModuleDescription } from '../value-objects/project-module-description.vo';
import { ProjectModuleId } from '../value-objects/project-module-id.vo';
import { ProjectModuleName } from '../value-objects/project-module-name.vo';

export class ProjectModule {
  constructor(
    readonly projectModuleId: ProjectModuleId,
    readonly code: ProjectModuleCode,
    readonly name: ProjectModuleName,
    readonly description: ProjectModuleDescription,
  ) {}
}
