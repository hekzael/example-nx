import { DomainException } from '../../../domain/shared/domain.exception';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { PasswordHash } from '../../../domain/user/value-objects/password-hash.vo';
import { ChangePasswordCommand } from '../command/change-password.command';
import { PasswordHashingPort } from '../../shared/ports/password-hashing.port';
import { PasswordPolicyPort } from '../../shared/ports/password-policy.port';

export interface ChangePasswordResult {
  status: string;
}

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHashing: PasswordHashingPort,
    private readonly passwordPolicy: PasswordPolicyPort,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<ChangePasswordResult> {
    const userId = UserId.create(command.userId);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new DomainException('USER_NOT_FOUND', 'Usuario no encontrado.');
    }

    const currentMatch = await this.passwordHashing.verify(
      command.currentPassword,
      user.passwordHash.value,
    );

    if (!currentMatch) {
      throw new DomainException('INVALID_PASSWORD', 'Password actual invalida.');
    }

    this.passwordPolicy.validate(command.newPassword);
    const newHashValue = await this.passwordHashing.hash(command.newPassword);
    user.changePassword(PasswordHash.create(newHashValue));

    await this.userRepository.save(user);

    return { status: 'OK' };
  }
}
