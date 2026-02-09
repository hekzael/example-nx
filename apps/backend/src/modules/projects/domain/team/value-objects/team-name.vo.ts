import { TeamNameException } from '../errors/team-name.exception';

export class TeamName {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0 || value.length > 255) {
      throw new TeamNameException('Invalid team name');
    }
  }
}
