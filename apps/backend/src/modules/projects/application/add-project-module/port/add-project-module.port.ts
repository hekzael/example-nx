import { AddProjectModuleCommand } from '../command/add-project-module.command';

export interface AddProjectModulePort {
  execute(command: AddProjectModuleCommand): Promise<string>;
}
