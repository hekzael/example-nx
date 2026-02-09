import { Email } from '../../../domain/user/value-objects/email.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { RequestPasswordResetCommand } from '../command/request-password-reset.command';
import { RequestPasswordResetPort } from '../port/request-password-reset.port';
import { PasswordResetTokenPort } from '../../shared/port/password-reset-token.port';

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
