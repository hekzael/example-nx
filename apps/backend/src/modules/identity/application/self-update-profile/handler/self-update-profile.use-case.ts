import { DomainException } from '../../../domain/shared/domain.exception';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { SelfUpdateProfileCommand } from '../command/self-update-profile.command';

export interface SelfUpdateProfileResult {
  userId: string;
}

export class SelfUpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: SelfUpdateProfileCommand): Promise<SelfUpdateProfileResult> {
    const userId = UserId.create(command.userId);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new DomainException('USER_NOT_FOUND', 'Usuario no encontrado.');
    }

    let email: Email | undefined;

    if (command.email) {
      email = Email.create(command.email);
      const existing = await this.userRepository.findByEmail(email);

      if (existing && existing.id.value !== user.id.value) {
        throw new DomainException('EMAIL_ALREADY_EXISTS', 'Email ya registrado.');
      }
    }

    user.updateProfile(command.name, email);
    await this.userRepository.save(user);

    return { userId: user.id.value };
  }
}
