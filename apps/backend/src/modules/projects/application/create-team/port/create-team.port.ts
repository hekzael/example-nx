import { CreateTeamCommand } from '../command/create-team.command';

export interface CreateTeamPort {
  execute(command: CreateTeamCommand): Promise<string>;
}
