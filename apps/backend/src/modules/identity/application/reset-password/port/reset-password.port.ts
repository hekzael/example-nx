import { ResetPasswordCommand } from '../command/reset-password.command';

export interface ResetPasswordPort {
  execute(command: ResetPasswordCommand): Promise<string>;
}
