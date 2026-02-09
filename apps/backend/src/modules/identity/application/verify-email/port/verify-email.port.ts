import { VerifyEmailCommand } from '@identity/application/verify-email/command/verify-email.command';

export interface VerifyEmailPort {
  execute(command: VerifyEmailCommand): Promise<string>;
}
