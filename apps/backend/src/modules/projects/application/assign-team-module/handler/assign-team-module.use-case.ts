import { TeamNotFoundException } from '@projects/domain/team/errors/team-not-found.exception';
import { TeamId } from '@projects/domain/team/value-objects/team-id.vo';
import { TeamRepositoryPort } from '@projects/domain/team/repository/team-repository.port';
import { ProjectModuleId } from '@projects/domain/project/value-objects/project-module-id.vo';
import { AssignTeamModuleCommand } from '../command/assign-team-module.command';
import { AssignTeamModulePort } from '../port/assign-team-module.port';

export class AssignTeamModuleUseCase implements AssignTeamModulePort {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(command: AssignTeamModuleCommand): Promise<void> {
    const teamId = new TeamId(command.teamId);
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new TeamNotFoundException();
    }

    team.assignModule(new ProjectModuleId(command.projectModuleId));
    await this.teamRepository.save(team);
  }
}
