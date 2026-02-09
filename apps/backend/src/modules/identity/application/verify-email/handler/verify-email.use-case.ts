import { InvalidTokenException } from '../../../domain/user/errors/invalid-token.exception';
import { UserNotFoundException } from '../../../domain/user/errors/user-not-found.exception';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { VerifyEmailCommand } from '../command/verify-email.command';
import { VerifyEmailPort } from '../port/verify-email.port';
import { EmailVerificationTokenPort } from '../../shared/port/email-verification-token.port';

export class VerifyEmailUseCase implements VerifyEmailPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly emailVerificationTokenPort: EmailVerificationTokenPort,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<string> {
    const userIdValue = await this.emailVerificationTokenPort.consume(
      command.token,
    );
    if (!userIdValue) {
      throw new InvalidTokenException();
    }

    const user = await this.userRepository.findById(new UserId(userIdValue));
    if (!user) {
      throw new UserNotFoundException();
    }

    user.verifyEmail();
    await this.userRepository.save(user);
    return userIdValue;
  }
}
