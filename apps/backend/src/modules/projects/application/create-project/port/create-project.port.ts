import { CreateProjectCommand } from '../command/create-project.command';

export interface CreateProjectPort {
  execute(command: CreateProjectCommand): Promise<string>;
}
