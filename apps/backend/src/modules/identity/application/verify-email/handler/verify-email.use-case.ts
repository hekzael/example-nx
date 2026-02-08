import { DomainException } from '../../../domain/shared/domain.exception';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { VerifyEmailCommand } from '../command/verify-email.command';
import { EmailVerificationTokenPort } from '../../shared/ports/email-verification-token.port';

export interface VerifyEmailResult {
  status: string;
}

export class VerifyEmailUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly emailVerificationToken: EmailVerificationTokenPort,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<VerifyEmailResult> {
    const userIdValue = await this.emailVerificationToken.verify(command.token);

    if (!userIdValue) {
      throw new DomainException('INVALID_TOKEN', 'Token invalido o expirado.');
    }

    const userId = UserId.create(userIdValue);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new DomainException('USER_NOT_FOUND', 'Usuario no encontrado.');
    }

    user.verifyEmail();
    await this.userRepository.save(user);
    await this.emailVerificationToken.invalidate(command.token);

    return { status: 'OK' };
  }
}
