import { Email } from '../../../domain/user/value-objects/email.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { RequestPasswordResetCommand } from '../command/request-password-reset.command';
import { PasswordResetTokenPort } from '../../shared/ports/password-reset-token.port';

export interface RequestPasswordResetResult {
  status: string;
  token?: string;
}

export class RequestPasswordResetUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordResetToken: PasswordResetTokenPort,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<RequestPasswordResetResult> {
    const email = Email.create(command.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return { status: 'OK' };
    }

    user.requestPasswordReset();
    await this.userRepository.save(user);

    const token = await this.passwordResetToken.generate(user.id.value);

    return {
      status: 'OK',
      token,
    };
  }
}
