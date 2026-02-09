import { ProjectCreatedEvent } from '../events/project-created.event';
import { ProjectEnvironmentAddedEvent } from '../events/project-environment-added.event';
import { ProjectModuleAddedEvent } from '../events/project-module-added.event';
import { ProjectPermissionCreatedEvent } from '../events/project-permission-created.event';
import { ProjectRoleCreatedEvent } from '../events/project-role-created.event';
import { ProjectException } from '../errors/project.exception';
import { ProjectCode } from '../value-objects/project-code.vo';
import { ProjectDescription } from '../value-objects/project-description.vo';
import { ProjectEnvironmentId } from '../value-objects/project-environment-id.vo';
import { ProjectId } from '../value-objects/project-id.vo';
import { ProjectModuleId } from '../value-objects/project-module-id.vo';
import { ProjectName } from '../value-objects/project-name.vo';
import { ProjectPermissionId } from '../value-objects/project-permission-id.vo';
import { ProjectRoleId } from '../value-objects/project-role-id.vo';
import { PermissionAction } from '../value-objects/permission-action.vo';
import { ProjectEnvironment } from './project-environment.entity';
import { ProjectModule } from './project-module.entity';
import { ProjectPermission } from './project-permission.entity';
import { ProjectRole } from './project-role.entity';

export class Project {
  private readonly domainEvents: Array<
    | ProjectCreatedEvent
    | ProjectModuleAddedEvent
    | ProjectEnvironmentAddedEvent
    | ProjectRoleCreatedEvent
    | ProjectPermissionCreatedEvent
  > = [];

  private constructor(
    private readonly projectId: ProjectId,
    private code: ProjectCode,
    private name: ProjectName,
    private description: ProjectDescription,
    private readonly modules: ProjectModule[],
    private readonly environments: ProjectEnvironment[],
    private readonly roles: ProjectRole[],
    private readonly permissions: ProjectPermission[],
  ) {}

  static createNew(params: {
    projectId: ProjectId;
    code: ProjectCode;
    name: ProjectName;
    description: ProjectDescription;
    now?: Date;
  }): Project {
    const now = params.now ?? new Date();
    const project = new Project(
      params.projectId,
      params.code,
      params.name,
      params.description,
      [],
      [],
      [],
      [],
    );
    project.domainEvents.push(
      new ProjectCreatedEvent(params.projectId.value, params.code.value, now),
    );
    return project;
  }

  static rehydrate(params: {
    projectId: ProjectId;
    code: ProjectCode;
    name: ProjectName;
    description: ProjectDescription;
    modules: ProjectModule[];
    environments: ProjectEnvironment[];
    roles: ProjectRole[];
    permissions: ProjectPermission[];
  }): Project {
    return new Project(
      params.projectId,
      params.code,
      params.name,
      params.description,
      params.modules,
      params.environments,
      params.roles,
      params.permissions,
    );
  }

  addModule(module: ProjectModule, now?: Date): void {
    if (this.modules.some((item) => item.code.value === module.code.value)) {
      throw new ProjectException('Project module code already exists');
    }
    this.modules.push(module);
    this.domainEvents.push(
      new ProjectModuleAddedEvent(
        this.projectId.value,
        module.projectModuleId.value,
        now ?? new Date(),
      ),
    );
  }

  addEnvironment(environment: ProjectEnvironment, now?: Date): void {
    if (
      this.environments.some(
        (item) => item.code.value === environment.code.value,
      )
    ) {
      throw new ProjectException('Project environment code already exists');
    }
    this.environments.push(environment);
    this.domainEvents.push(
      new ProjectEnvironmentAddedEvent(
        this.projectId.value,
        environment.projectEnvironmentId.value,
        now ?? new Date(),
      ),
    );
  }

  addRole(role: ProjectRole, now?: Date): void {
    if (this.roles.some((item) => item.name.value === role.name.value)) {
      throw new ProjectException('Project role name already exists');
    }
    this.roles.push(role);
    this.domainEvents.push(
      new ProjectRoleCreatedEvent(
        this.projectId.value,
        role.projectRoleId.value,
        now ?? new Date(),
      ),
    );
  }

  addPermission(permission: ProjectPermission, now?: Date): void {
    if (
      this.permissions.some(
        (item) =>
          item.action.value === permission.action.value &&
          item.projectModuleId?.value === permission.projectModuleId?.value &&
          item.projectEnvironmentId?.value ===
            permission.projectEnvironmentId?.value,
      )
    ) {
      throw new ProjectException('Project permission already exists');
    }
    this.permissions.push(permission);
    this.domainEvents.push(
      new ProjectPermissionCreatedEvent(
        this.projectId.value,
        permission.projectPermissionId.value,
        now ?? new Date(),
      ),
    );
  }

  pullDomainEvents(): Array<
    | ProjectCreatedEvent
    | ProjectModuleAddedEvent
    | ProjectEnvironmentAddedEvent
    | ProjectRoleCreatedEvent
    | ProjectPermissionCreatedEvent
  > {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  getProjectId(): ProjectId {
    return this.projectId;
  }

  getCode(): ProjectCode {
    return this.code;
  }

  getName(): ProjectName {
    return this.name;
  }

  getDescription(): ProjectDescription {
    return this.description;
  }

  getModules(): ProjectModule[] {
    return [...this.modules];
  }

  getEnvironments(): ProjectEnvironment[] {
    return [...this.environments];
  }

  getRoles(): ProjectRole[] {
    return [...this.roles];
  }

  getPermissions(): ProjectPermission[] {
    return [...this.permissions];
  }

  getModuleById(projectModuleId: ProjectModuleId): ProjectModule | null {
    return (
      this.modules.find((module) => module.projectModuleId.value === projectModuleId.value) ??
      null
    );
  }

  getEnvironmentById(projectEnvironmentId: ProjectEnvironmentId): ProjectEnvironment | null {
    return (
      this.environments.find(
        (environment) =>
          environment.projectEnvironmentId.value === projectEnvironmentId.value,
      ) ?? null
    );
  }

  hasPermission(params: {
    action: PermissionAction;
    projectModuleId: ProjectModuleId | null;
    projectEnvironmentId: ProjectEnvironmentId | null;
  }): boolean {
    return this.permissions.some(
      (permission) =>
        permission.action.value === params.action.value &&
        permission.projectModuleId?.value === params.projectModuleId?.value &&
        permission.projectEnvironmentId?.value ===
          params.projectEnvironmentId?.value,
    );
  }
}
