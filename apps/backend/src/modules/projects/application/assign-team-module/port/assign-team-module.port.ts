import { AssignTeamModuleCommand } from '../command/assign-team-module.command';

export interface AssignTeamModulePort {
  execute(command: AssignTeamModuleCommand): Promise<void>;
}
