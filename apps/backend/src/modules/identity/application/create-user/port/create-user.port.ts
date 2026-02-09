import { CreateUserCommand } from '../command/create-user.command';

export interface CreateUserPort {
  execute(command: CreateUserCommand): Promise<string>;
}
