import { LogoutCommand } from '@identity/application/logout/command/logout.command';

export interface LogoutPort {
  execute(command: LogoutCommand): Promise<void>;
}
