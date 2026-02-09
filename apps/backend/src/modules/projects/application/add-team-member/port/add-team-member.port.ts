import { AddTeamMemberCommand } from '../command/add-team-member.command';

export interface AddTeamMemberPort {
  execute(command: AddTeamMemberCommand): Promise<string>;
}
