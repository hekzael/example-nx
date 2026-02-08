import { DomainException } from '../../../domain/shared/domain.exception';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { PasswordHash } from '../../../domain/user/value-objects/password-hash.vo';
import { ResetPasswordCommand } from '../command/reset-password.command';
import { PasswordHashingPort } from '../../shared/ports/password-hashing.port';
import { PasswordPolicyPort } from '../../shared/ports/password-policy.port';
import { PasswordResetTokenPort } from '../../shared/ports/password-reset-token.port';

export interface ResetPasswordResult {
  status: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHashing: PasswordHashingPort,
    private readonly passwordPolicy: PasswordPolicyPort,
    private readonly passwordResetToken: PasswordResetTokenPort,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<ResetPasswordResult> {
    const userIdValue = await this.passwordResetToken.verify(command.token);

    if (!userIdValue) {
      throw new DomainException('INVALID_TOKEN', 'Token invalido o expirado.');
    }

    const userId = UserId.create(userIdValue);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new DomainException('USER_NOT_FOUND', 'Usuario no encontrado.');
    }

    this.passwordPolicy.validate(command.newPassword);
    const hashValue = await this.passwordHashing.hash(command.newPassword);
    user.resetPassword(PasswordHash.create(hashValue));

    await this.userRepository.save(user);
    await this.passwordResetToken.invalidate(command.token);

    return { status: 'OK' };
  }
}
