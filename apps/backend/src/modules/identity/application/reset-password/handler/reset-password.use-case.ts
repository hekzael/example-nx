import { InvalidTokenException } from '@identity/domain/user/errors/invalid-token.exception';
import { UserNotFoundException } from '@identity/domain/user/errors/user-not-found.exception';
import { PasswordHash } from '@identity/domain/user/value-objects/password-hash.vo';
import { UserId } from '@identity/domain/user/value-objects/user-id.vo';
import { UserRepositoryPort } from '@identity/domain/user/repository/user-repository.port';
import { ResetPasswordCommand } from '@identity/application/reset-password/command/reset-password.command';
import { ResetPasswordPort } from '@identity/application/reset-password/port/reset-password.port';
import { PasswordPolicyService } from '@identity/application/shared/password-policy/password-policy.service';
import { PasswordHashingPort } from '@identity/application/shared/port/password-hashing.port';
import { PasswordResetTokenPort } from '@identity/application/shared/port/password-reset-token.port';

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
