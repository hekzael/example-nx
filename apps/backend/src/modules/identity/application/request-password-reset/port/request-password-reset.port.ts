import { RequestPasswordResetCommand } from '../command/request-password-reset.command';

export interface RequestPasswordResetPort {
  execute(command: RequestPasswordResetCommand): Promise<string | null>;
}
