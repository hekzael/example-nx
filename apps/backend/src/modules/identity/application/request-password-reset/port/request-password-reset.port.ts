import { RequestPasswordResetCommand } from '@identity/application/request-password-reset/command/request-password-reset.command';

export interface RequestPasswordResetPort {
  execute(command: RequestPasswordResetCommand): Promise<string | null>;
}
