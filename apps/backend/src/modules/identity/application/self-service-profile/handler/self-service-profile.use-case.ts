import { DomainException } from '../../../domain/shared/domain.exception';
import { User } from '../../../domain/user/entity/user.entity';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { SelfServiceProfileCommand } from '../command/self-service-profile.command';

export interface SelfServiceProfileResult {
  user: User;
}

export class SelfServiceProfileUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: SelfServiceProfileCommand): Promise<SelfServiceProfileResult> {
    const userId = UserId.create(command.userId);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new DomainException('USER_NOT_FOUND', 'Usuario no encontrado.');
    }

    return { user };
  }
}
