import { ChangePasswordCommand } from '@identity/application/change-password/command/change-password.command';

export interface ChangePasswordPort {
  execute(command: ChangePasswordCommand): Promise<void>;
}
