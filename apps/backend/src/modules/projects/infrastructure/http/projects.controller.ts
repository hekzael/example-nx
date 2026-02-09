import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateProjectUseCase } from '@projects/application/create-project/handler/create-project.use-case';
import { CreateProjectCommand } from '@projects/application/create-project/command/create-project.command';
import { AddProjectModuleUseCase } from '@projects/application/add-project-module/handler/add-project-module.use-case';
import { AddProjectModuleCommand } from '@projects/application/add-project-module/command/add-project-module.command';
import { AddProjectEnvironmentUseCase } from '@projects/application/add-project-environment/handler/add-project-environment.use-case';
import { AddProjectEnvironmentCommand } from '@projects/application/add-project-environment/command/add-project-environment.command';
import { CreateProjectHttpDto } from '@projects/infrastructure/http/dtos/create-project.http-dto';
import { AddProjectModuleHttpDto } from '@projects/infrastructure/http/dtos/add-project-module.http-dto';
import { AddProjectEnvironmentHttpDto } from '@projects/infrastructure/http/dtos/add-project-environment.http-dto';
import { ProjectCreatedResponseDto } from '@projects/infrastructure/http/dtos/project-created.response-dto';
import { ProjectModuleCreatedResponseDto } from '@projects/infrastructure/http/dtos/project-module-created.response-dto';
import { ProjectEnvironmentCreatedResponseDto } from '@projects/infrastructure/http/dtos/project-environment-created.response-dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly addProjectModuleUseCase: AddProjectModuleUseCase,
    private readonly addProjectEnvironmentUseCase: AddProjectEnvironmentUseCase,
  ) {}

  @Post()
  async createProject(
    @Body() body: CreateProjectHttpDto,
  ): Promise<ProjectCreatedResponseDto> {
    const projectId = await this.createProjectUseCase.execute(
      new CreateProjectCommand(body.code, body.name, body.description ?? null),
    );
    return plainToInstance(
      ProjectCreatedResponseDto,
      { projectId },
      { excludeExtraneousValues: true },
    );
  }

  @Post(':projectId/modules')
  async addProjectModule(
    @Param('projectId') projectId: string,
    @Body() body: AddProjectModuleHttpDto,
  ): Promise<ProjectModuleCreatedResponseDto> {
    const projectModuleId = await this.addProjectModuleUseCase.execute(
      new AddProjectModuleCommand(
        projectId,
        body.code,
        body.name,
        body.description ?? null,
      ),
    );
    return plainToInstance(
      ProjectModuleCreatedResponseDto,
      { projectModuleId },
      { excludeExtraneousValues: true },
    );
  }

  @Post(':projectId/environments')
  async addProjectEnvironment(
    @Param('projectId') projectId: string,
    @Body() body: AddProjectEnvironmentHttpDto,
  ): Promise<ProjectEnvironmentCreatedResponseDto> {
    const projectEnvironmentId =
      await this.addProjectEnvironmentUseCase.execute(
        new AddProjectEnvironmentCommand(
          projectId,
          body.code,
          body.name,
          body.description ?? null,
          body.priority,
        ),
      );
    return plainToInstance(
      ProjectEnvironmentCreatedResponseDto,
      { projectEnvironmentId },
      { excludeExtraneousValues: true },
    );
  }
}
