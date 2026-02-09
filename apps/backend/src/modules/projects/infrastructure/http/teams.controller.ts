import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateTeamUseCase } from '@projects/application/create-team/handler/create-team.use-case';
import { CreateTeamCommand } from '@projects/application/create-team/command/create-team.command';
import { AddTeamMemberUseCase } from '@projects/application/add-team-member/handler/add-team-member.use-case';
import { AddTeamMemberCommand } from '@projects/application/add-team-member/command/add-team-member.command';
import { AssignTeamModuleUseCase } from '@projects/application/assign-team-module/handler/assign-team-module.use-case';
import { AssignTeamModuleCommand } from '@projects/application/assign-team-module/command/assign-team-module.command';
import { CreateTeamHttpDto } from '@projects/infrastructure/http/dtos/create-team.http-dto';
import { AddTeamMemberHttpDto } from '@projects/infrastructure/http/dtos/add-team-member.http-dto';
import { AssignTeamModuleHttpDto } from '@projects/infrastructure/http/dtos/assign-team-module.http-dto';
import { TeamCreatedResponseDto } from '@projects/infrastructure/http/dtos/team-created.response-dto';
import { TeamMemberCreatedResponseDto } from '@projects/infrastructure/http/dtos/team-member-created.response-dto';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly createTeamUseCase: CreateTeamUseCase,
    private readonly addTeamMemberUseCase: AddTeamMemberUseCase,
    private readonly assignTeamModuleUseCase: AssignTeamModuleUseCase,
  ) {}

  @Post()
  async createTeam(
    @Body() body: CreateTeamHttpDto,
  ): Promise<TeamCreatedResponseDto> {
    const teamId = await this.createTeamUseCase.execute(
      new CreateTeamCommand(body.projectId, body.name, body.description ?? null),
    );
    return plainToInstance(
      TeamCreatedResponseDto,
      { teamId },
      { excludeExtraneousValues: true },
    );
  }

  @Post(':teamId/members')
  async addTeamMember(
    @Param('teamId') teamId: string,
    @Body() body: AddTeamMemberHttpDto,
  ): Promise<TeamMemberCreatedResponseDto> {
    const teamMemberId = await this.addTeamMemberUseCase.execute(
      new AddTeamMemberCommand(
        teamId,
        body.userId,
        body.role,
        body.validFrom,
        body.validUntil ?? null,
      ),
    );
    return plainToInstance(
      TeamMemberCreatedResponseDto,
      { teamMemberId },
      { excludeExtraneousValues: true },
    );
  }

  @Post(':teamId/modules')
  @HttpCode(204)
  async assignTeamModule(
    @Param('teamId') teamId: string,
    @Body() body: AssignTeamModuleHttpDto,
  ): Promise<void> {
    await this.assignTeamModuleUseCase.execute(
      new AssignTeamModuleCommand(teamId, body.projectModuleId),
    );
  }
}
