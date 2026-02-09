import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from '@projects/infrastructure/http/projects.controller';
import { TeamsController } from '@projects/infrastructure/http/teams.controller';
import { CreateProjectUseCase } from '@projects/application/create-project/handler/create-project.use-case';
import { AddProjectModuleUseCase } from '@projects/application/add-project-module/handler/add-project-module.use-case';
import { AddProjectEnvironmentUseCase } from '@projects/application/add-project-environment/handler/add-project-environment.use-case';
import { CreateTeamUseCase } from '@projects/application/create-team/handler/create-team.use-case';
import { AddTeamMemberUseCase } from '@projects/application/add-team-member/handler/add-team-member.use-case';
import { AssignTeamModuleUseCase } from '@projects/application/assign-team-module/handler/assign-team-module.use-case';
import { IdGeneratorPort } from '@projects/application/shared/port/id-generator.port';
import { ProjectRepositoryPort } from '@projects/domain/project/repository/project-repository.port';
import { TeamRepositoryPort } from '@projects/domain/team/repository/team-repository.port';
import { CryptoIdGeneratorAdapter } from '@projects/infrastructure/ids/crypto/crypto-id-generator.adapter';
import { ProjectOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project.orm-entity';
import { ProjectModuleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-module.orm-entity';
import { ProjectEnvironmentOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-environment.orm-entity';
import { ProjectRoleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-role.orm-entity';
import { ProjectPermissionOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-permission.orm-entity';
import { ProjectRolePermissionOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-role-permission.orm-entity';
import { UserProjectRoleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/user-project-role.orm-entity';
import { TeamOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/team.orm-entity';
import { TeamMemberOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/team-member.orm-entity';
import { TeamModuleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/team-module.orm-entity';
import { TypeOrmProjectRepositoryAdapter } from '@projects/infrastructure/persistence/typeorm/adapters/typeorm-project-repository.adapter';
import { TypeOrmTeamRepositoryAdapter } from '@projects/infrastructure/persistence/typeorm/adapters/typeorm-team-repository.adapter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const PROJECT_REPOSITORY_PORT = 'ProjectRepositoryPort';
const TEAM_REPOSITORY_PORT = 'TeamRepositoryPort';
const ID_GENERATOR_PORT = 'IdGeneratorPort';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectOrmEntity,
      ProjectModuleOrmEntity,
      ProjectEnvironmentOrmEntity,
      ProjectRoleOrmEntity,
      ProjectPermissionOrmEntity,
      ProjectRolePermissionOrmEntity,
      UserProjectRoleOrmEntity,
      TeamOrmEntity,
      TeamMemberOrmEntity,
      TeamModuleOrmEntity,
    ]),
  ],
  controllers: [ProjectsController, TeamsController],
  providers: [
    {
      provide: ID_GENERATOR_PORT,
      useClass: CryptoIdGeneratorAdapter,
    },
    {
      provide: PROJECT_REPOSITORY_PORT,
      useFactory: (
        projectRepo: Repository<ProjectOrmEntity>,
        moduleRepo: Repository<ProjectModuleOrmEntity>,
        environmentRepo: Repository<ProjectEnvironmentOrmEntity>,
        roleRepo: Repository<ProjectRoleOrmEntity>,
        permissionRepo: Repository<ProjectPermissionOrmEntity>,
        rolePermissionRepo: Repository<ProjectRolePermissionOrmEntity>,
        userProjectRoleRepo: Repository<UserProjectRoleOrmEntity>,
      ) =>
        new TypeOrmProjectRepositoryAdapter(
          projectRepo,
          moduleRepo,
          environmentRepo,
          roleRepo,
          permissionRepo,
          rolePermissionRepo,
          userProjectRoleRepo,
        ),
      inject: [
        getRepositoryToken(ProjectOrmEntity),
        getRepositoryToken(ProjectModuleOrmEntity),
        getRepositoryToken(ProjectEnvironmentOrmEntity),
        getRepositoryToken(ProjectRoleOrmEntity),
        getRepositoryToken(ProjectPermissionOrmEntity),
        getRepositoryToken(ProjectRolePermissionOrmEntity),
        getRepositoryToken(UserProjectRoleOrmEntity),
      ],
    },
    {
      provide: TEAM_REPOSITORY_PORT,
      useFactory: (
        teamRepo: Repository<TeamOrmEntity>,
        teamMemberRepo: Repository<TeamMemberOrmEntity>,
        teamModuleRepo: Repository<TeamModuleOrmEntity>,
      ) => new TypeOrmTeamRepositoryAdapter(teamRepo, teamMemberRepo, teamModuleRepo),
      inject: [
        getRepositoryToken(TeamOrmEntity),
        getRepositoryToken(TeamMemberOrmEntity),
        getRepositoryToken(TeamModuleOrmEntity),
      ],
    },
    {
      provide: CreateProjectUseCase,
      useFactory: (
        projectRepository: ProjectRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
      ) => new CreateProjectUseCase(projectRepository, idGeneratorPort),
      inject: [PROJECT_REPOSITORY_PORT, ID_GENERATOR_PORT],
    },
    {
      provide: AddProjectModuleUseCase,
      useFactory: (
        projectRepository: ProjectRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
      ) => new AddProjectModuleUseCase(projectRepository, idGeneratorPort),
      inject: [PROJECT_REPOSITORY_PORT, ID_GENERATOR_PORT],
    },
    {
      provide: AddProjectEnvironmentUseCase,
      useFactory: (
        projectRepository: ProjectRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
      ) => new AddProjectEnvironmentUseCase(projectRepository, idGeneratorPort),
      inject: [PROJECT_REPOSITORY_PORT, ID_GENERATOR_PORT],
    },
    {
      provide: CreateTeamUseCase,
      useFactory: (
        teamRepository: TeamRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
      ) => new CreateTeamUseCase(teamRepository, idGeneratorPort),
      inject: [TEAM_REPOSITORY_PORT, ID_GENERATOR_PORT],
    },
    {
      provide: AddTeamMemberUseCase,
      useFactory: (
        teamRepository: TeamRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
      ) => new AddTeamMemberUseCase(teamRepository, idGeneratorPort),
      inject: [TEAM_REPOSITORY_PORT, ID_GENERATOR_PORT],
    },
    {
      provide: AssignTeamModuleUseCase,
      useFactory: (teamRepository: TeamRepositoryPort) =>
        new AssignTeamModuleUseCase(teamRepository),
      inject: [TEAM_REPOSITORY_PORT],
    },
  ],
  exports: [
    CreateProjectUseCase,
    AddProjectModuleUseCase,
    AddProjectEnvironmentUseCase,
    CreateTeamUseCase,
    AddTeamMemberUseCase,
    AssignTeamModuleUseCase,
  ],
})
export class ProjectsModule {}
