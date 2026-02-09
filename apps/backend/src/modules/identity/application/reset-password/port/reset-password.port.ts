import { ResetPasswordCommand } from '@identity/application/reset-password/command/reset-password.command';

export interface ResetPasswordPort {
  execute(command: ResetPasswordCommand): Promise<string>;
}
