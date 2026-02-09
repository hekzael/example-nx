import { Team } from '@projects/domain/team/entity/team.entity';
import { TeamDescription } from '@projects/domain/team/value-objects/team-description.vo';
import { TeamId } from '@projects/domain/team/value-objects/team-id.vo';
import { TeamName } from '@projects/domain/team/value-objects/team-name.vo';
import { ProjectId } from '@projects/domain/project/value-objects/project-id.vo';
import { TeamRepositoryPort } from '@projects/domain/team/repository/team-repository.port';
import { IdGeneratorPort } from '@projects/application/shared/port/id-generator.port';
import { CreateTeamCommand } from '../command/create-team.command';
import { CreateTeamPort } from '../port/create-team.port';

export class CreateTeamUseCase implements CreateTeamPort {
  constructor(
    private readonly teamRepository: TeamRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
  ) {}

  async execute(command: CreateTeamCommand): Promise<string> {
    const teamId = new TeamId(this.idGeneratorPort.generate());
    const projectId = new ProjectId(command.projectId);
    const team = Team.createNew({
      teamId,
      projectId,
      name: new TeamName(command.name),
      description: new TeamDescription(command.description ?? null),
    });

    await this.teamRepository.save(team);
    return teamId.value;
  }
}
