import { ChangePasswordCommand } from '@identity/application/change-password/command/change-password.command';
import { ChangePasswordPort } from '@identity/application/change-password/port/change-password.port';
import { PasswordPolicyService } from '@identity/application/shared/password-policy/password-policy.service';
import { PasswordHashingPort } from '@identity/application/shared/port/password-hashing.port';
import { UserNotFoundException } from '@identity/domain/user/errors/user-not-found.exception';
import { UserException } from '@identity/domain/user/errors/user.exception';
import { UserRepositoryPort } from '@identity/domain/user/repository/user-repository.port';
import { PasswordHash } from '@identity/domain/user/value-objects/password-hash.vo';
import { UserId } from '@identity/domain/user/value-objects/user-id.vo';

export class ChangePasswordUseCase implements ChangePasswordPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHashingPort: PasswordHashingPort,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const userId = new UserId(command.userId);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const matches = await this.passwordHashingPort.verify(
      command.currentPassword,
      user.getPasswordHash().value,
    );
    if (!matches) {
      throw new UserException('Invalid current password');
    }

    PasswordPolicyService.validate(command.newPassword);
    const hash = await this.passwordHashingPort.hash(command.newPassword);
    user.changePassword({ passwordHash: new PasswordHash(hash) });

    await this.userRepository.save(user);
  }
}
