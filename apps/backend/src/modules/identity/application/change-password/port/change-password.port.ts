import { ChangePasswordCommand } from '../command/change-password.command';

export interface ChangePasswordPort {
  execute(command: ChangePasswordCommand): Promise<void>;
}
