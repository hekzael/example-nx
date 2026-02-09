import { Repository } from 'typeorm';
import { Project } from '@projects/domain/project/entity/project.entity';
import { ProjectEnvironment } from '@projects/domain/project/entity/project-environment.entity';
import { ProjectModule } from '@projects/domain/project/entity/project-module.entity';
import { ProjectPermission } from '@projects/domain/project/entity/project-permission.entity';
import { ProjectRole } from '@projects/domain/project/entity/project-role.entity';
import { ProjectCode } from '@projects/domain/project/value-objects/project-code.vo';
import { ProjectDescription } from '@projects/domain/project/value-objects/project-description.vo';
import { ProjectEnvironmentCode } from '@projects/domain/project/value-objects/project-environment-code.vo';
import { ProjectEnvironmentDescription } from '@projects/domain/project/value-objects/project-environment-description.vo';
import { ProjectEnvironmentId } from '@projects/domain/project/value-objects/project-environment-id.vo';
import { ProjectEnvironmentName } from '@projects/domain/project/value-objects/project-environment-name.vo';
import { ProjectEnvironmentPriority } from '@projects/domain/project/value-objects/project-environment-priority.vo';
import { ProjectId } from '@projects/domain/project/value-objects/project-id.vo';
import { ProjectModuleCode } from '@projects/domain/project/value-objects/project-module-code.vo';
import { ProjectModuleDescription } from '@projects/domain/project/value-objects/project-module-description.vo';
import { ProjectModuleId } from '@projects/domain/project/value-objects/project-module-id.vo';
import { ProjectModuleName } from '@projects/domain/project/value-objects/project-module-name.vo';
import { PermissionAction } from '@projects/domain/project/value-objects/permission-action.vo';
import { ProjectPermissionId } from '@projects/domain/project/value-objects/project-permission-id.vo';
import { ProjectRoleDescription } from '@projects/domain/project/value-objects/project-role-description.vo';
import { ProjectRoleId } from '@projects/domain/project/value-objects/project-role-id.vo';
import { ProjectRoleName } from '@projects/domain/project/value-objects/project-role-name.vo';
import { ProjectName } from '@projects/domain/project/value-objects/project-name.vo';
import { ProjectRepositoryPort } from '@projects/domain/project/repository/project-repository.port';
import { ProjectEnvironmentOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-environment.orm-entity';
import { ProjectModuleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-module.orm-entity';
import { ProjectOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project.orm-entity';
import { ProjectPermissionOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-permission.orm-entity';
import { ProjectRoleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-role.orm-entity';
import { ProjectRolePermissionOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-role-permission.orm-entity';
import { UserProjectRoleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/user-project-role.orm-entity';

export class TypeOrmProjectRepositoryAdapter implements ProjectRepositoryPort {
  constructor(
    private readonly projectRepository: Repository<ProjectOrmEntity>,
    private readonly moduleRepository: Repository<ProjectModuleOrmEntity>,
    private readonly environmentRepository: Repository<ProjectEnvironmentOrmEntity>,
    private readonly roleRepository: Repository<ProjectRoleOrmEntity>,
    private readonly permissionRepository: Repository<ProjectPermissionOrmEntity>,
    private readonly rolePermissionRepository: Repository<ProjectRolePermissionOrmEntity>,
    private readonly userProjectRoleRepository: Repository<UserProjectRoleOrmEntity>,
  ) {}

  async save(project: Project): Promise<void> {
    await this.projectRepository.save(this.toProjectOrm(project));
    await this.moduleRepository.save(
      project.getModules().map((item) =>
        this.toProjectModuleOrm(project.getProjectId().value, item),
      ),
    );
    await this.environmentRepository.save(
      project.getEnvironments().map((item) =>
        this.toProjectEnvironmentOrm(project.getProjectId().value, item),
      ),
    );
    await this.roleRepository.save(
      project.getRoles().map((item) =>
        this.toProjectRoleOrm(project.getProjectId().value, item),
      ),
    );
    await this.permissionRepository.save(
      project.getPermissions().map((item) =>
        this.toProjectPermissionOrm(project.getProjectId().value, item),
      ),
    );
  }

  async findById(projectId: ProjectId): Promise<Project | null> {
    const project = await this.projectRepository.findOne({
      where: { projectId: projectId.value },
    });
    if (!project) {
      return null;
    }

    const [modules, environments, roles, permissions] = await Promise.all([
      this.moduleRepository.find({ where: { projectId: projectId.value } }),
      this.environmentRepository.find({ where: { projectId: projectId.value } }),
      this.roleRepository.find({ where: { projectId: projectId.value } }),
      this.permissionRepository.find({ where: { projectId: projectId.value } }),
    ]);

    return Project.rehydrate({
      projectId: new ProjectId(project.projectId),
      code: new ProjectCode(project.code),
      name: new ProjectName(project.name),
      description: new ProjectDescription(project.description ?? null),
      modules: modules.map((item) => this.toProjectModule(item)),
      environments: environments.map((item) => this.toProjectEnvironment(item)),
      roles: roles.map((item) => this.toProjectRole(item)),
      permissions: permissions.map((item) => this.toProjectPermission(item)),
    });
  }

  async findByCode(code: ProjectCode): Promise<Project | null> {
    const project = await this.projectRepository.findOne({
      where: { code: code.value },
    });
    if (!project) {
      return null;
    }
    return this.findById(new ProjectId(project.projectId));
  }

  async existsByCode(code: ProjectCode): Promise<boolean> {
    const count = await this.projectRepository.count({
      where: { code: code.value },
      take: 1,
    });
    return count > 0;
  }

  private toProjectOrm(project: Project): ProjectOrmEntity {
    const orm = new ProjectOrmEntity();
    orm.projectId = project.getProjectId().value;
    orm.code = project.getCode().value;
    orm.name = project.getName().value;
    orm.description = project.getDescription().value ?? null;
    return orm;
  }

  private toProjectModuleOrm(
    projectId: string,
    module: ProjectModule,
  ): ProjectModuleOrmEntity {
    const orm = new ProjectModuleOrmEntity();
    orm.projectModuleId = module.projectModuleId.value;
    orm.projectId = projectId;
    orm.code = module.code.value;
    orm.name = module.name.value;
    orm.description = module.description.value ?? null;
    return orm;
  }

  private toProjectEnvironmentOrm(
    projectId: string,
    environment: ProjectEnvironment,
  ): ProjectEnvironmentOrmEntity {
    const orm = new ProjectEnvironmentOrmEntity();
    orm.projectEnvironmentId = environment.projectEnvironmentId.value;
    orm.projectId = projectId;
    orm.code = environment.code.value;
    orm.name = environment.name.value;
    orm.description = environment.description.value ?? null;
    orm.priority = environment.priority.value;
    return orm;
  }

  private toProjectRoleOrm(
    projectId: string,
    role: ProjectRole,
  ): ProjectRoleOrmEntity {
    const orm = new ProjectRoleOrmEntity();
    orm.projectRoleId = role.projectRoleId.value;
    orm.projectId = projectId;
    orm.name = role.name.value;
    orm.description = role.description.value ?? null;
    return orm;
  }

  private toProjectPermissionOrm(
    projectId: string,
    permission: ProjectPermission,
  ): ProjectPermissionOrmEntity {
    const orm = new ProjectPermissionOrmEntity();
    orm.projectPermissionId = permission.projectPermissionId.value;
    orm.projectId = projectId;
    orm.projectModuleId = permission.projectModuleId?.value ?? null;
    orm.projectEnvironmentId = permission.projectEnvironmentId?.value ?? null;
    orm.action = permission.action.value;
    return orm;
  }

  private toProjectModule(module: ProjectModuleOrmEntity): ProjectModule {
    return new ProjectModule(
      new ProjectModuleId(module.projectModuleId),
      new ProjectModuleCode(module.code),
      new ProjectModuleName(module.name),
      new ProjectModuleDescription(module.description ?? null),
    );
  }

  private toProjectEnvironment(
    environment: ProjectEnvironmentOrmEntity,
  ): ProjectEnvironment {
    return new ProjectEnvironment(
      new ProjectEnvironmentId(environment.projectEnvironmentId),
      new ProjectEnvironmentCode(environment.code),
      new ProjectEnvironmentName(environment.name),
      new ProjectEnvironmentDescription(environment.description ?? null),
      new ProjectEnvironmentPriority(environment.priority),
    );
  }

  private toProjectRole(role: ProjectRoleOrmEntity): ProjectRole {
    return new ProjectRole(
      new ProjectRoleId(role.projectRoleId),
      new ProjectRoleName(role.name),
      new ProjectRoleDescription(role.description ?? null),
    );
  }

  private toProjectPermission(
    permission: ProjectPermissionOrmEntity,
  ): ProjectPermission {
    return new ProjectPermission(
      new ProjectPermissionId(permission.projectPermissionId),
      new PermissionAction(permission.action),
      permission.projectModuleId
        ? new ProjectModuleId(permission.projectModuleId)
        : null,
      permission.projectEnvironmentId
        ? new ProjectEnvironmentId(permission.projectEnvironmentId)
        : null,
    );
  }
}
