import { VerifyEmailCommand } from '../command/verify-email.command';

export interface VerifyEmailPort {
  execute(command: VerifyEmailCommand): Promise<string>;
}
