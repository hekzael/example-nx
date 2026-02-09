import { Email } from '@identity/domain/user/value-objects/email.vo';
import { UserRepositoryPort } from '@identity/domain/user/repository/user-repository.port';
import { RequestPasswordResetCommand } from '@identity/application/request-password-reset/command/request-password-reset.command';
import { RequestPasswordResetPort } from '@identity/application/request-password-reset/port/request-password-reset.port';
import { PasswordResetTokenPort } from '@identity/application/shared/port/password-reset-token.port';

export class RequestPasswordResetUseCase implements RequestPasswordResetPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordResetTokenPort: PasswordResetTokenPort,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<string | null> {
    const email = new Email(command.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    return this.passwordResetTokenPort.create(user.getUserId().value);
  }
}
