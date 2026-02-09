import { CreateUserCommand } from '@identity/application/create-user/command/create-user.command';

export interface CreateUserPort {
  execute(command: CreateUserCommand): Promise<string>;
}
