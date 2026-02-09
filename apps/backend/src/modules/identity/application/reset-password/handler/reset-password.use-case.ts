import { InvalidTokenException } from '../../../domain/user/errors/invalid-token.exception';
import { UserNotFoundException } from '../../../domain/user/errors/user-not-found.exception';
import { PasswordHash } from '../../../domain/user/value-objects/password-hash.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { ResetPasswordCommand } from '../command/reset-password.command';
import { ResetPasswordPort } from '../port/reset-password.port';
import { PasswordPolicyService } from '../../shared/password-policy/password-policy.service';
import { PasswordHashingPort } from '../../shared/port/password-hashing.port';
import { PasswordResetTokenPort } from '../../shared/port/password-reset-token.port';

export class ResetPasswordUseCase implements ResetPasswordPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordResetTokenPort: PasswordResetTokenPort,
    private readonly passwordHashingPort: PasswordHashingPort,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<string> {
    const userIdValue = await this.passwordResetTokenPort.consume(command.token);
    if (!userIdValue) {
      throw new InvalidTokenException();
    }

    const user = await this.userRepository.findById(new UserId(userIdValue));
    if (!user) {
      throw new UserNotFoundException();
    }

    PasswordPolicyService.validate(command.newPassword);
    const hash = await this.passwordHashingPort.hash(command.newPassword);
    user.changePassword({ passwordHash: new PasswordHash(hash) });

    await this.userRepository.save(user);
    return userIdValue;
  }
}
