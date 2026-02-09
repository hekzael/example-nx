import { AddProjectEnvironmentCommand } from '../command/add-project-environment.command';

export interface AddProjectEnvironmentPort {
  execute(command: AddProjectEnvironmentCommand): Promise<string>;
}
