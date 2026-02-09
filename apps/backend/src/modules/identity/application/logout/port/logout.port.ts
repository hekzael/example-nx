import { LogoutCommand } from '../command/logout.command';

export interface LogoutPort {
  execute(command: LogoutCommand): Promise<void>;
}
