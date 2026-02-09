import { TeamDescriptionException } from '../errors/team-description.exception';

export class TeamDescription {
  constructor(readonly value: string | null) {
    if (value === null || value === undefined) {
      return;
    }
    if (value.length > 1000) {
      throw new TeamDescriptionException('Invalid team description');
    }
  }
}
