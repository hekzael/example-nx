import { TeamException } from './team.exception';

export class TeamNotFoundException extends TeamException {
  constructor(message = 'Team not found') {
    super(message);
    this.name = 'TeamNotFoundException';
  }
}
