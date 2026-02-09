import { Team } from '../entity/team.entity';
import { TeamId } from '../value-objects/team-id.vo';

export interface TeamRepositoryPort {
  save(team: Team): Promise<void>;
  findById(teamId: TeamId): Promise<Team | null>;
}
