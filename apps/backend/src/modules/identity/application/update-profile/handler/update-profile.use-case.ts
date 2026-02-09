import { UserNotFoundException } from '@identity/domain/user/errors/user-not-found.exception';
import { DisplayName } from '@identity/domain/user/value-objects/display-name.vo';
import { UserId } from '@identity/domain/user/value-objects/user-id.vo';
import { UserRepositoryPort } from '@identity/domain/user/repository/user-repository.port';
import { UpdateProfileCommand } from '@identity/application/update-profile/command/update-profile.command';
import { UpdateProfilePort } from '@identity/application/update-profile/port/update-profile.port';

export class UpdateProfileUseCase implements UpdateProfilePort {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    const user = await this.userRepository.findById(new UserId(command.userId));
    if (!user) {
      throw new UserNotFoundException();
    }

    if (command.displayName !== undefined) {
      user.changeDisplayName(new DisplayName(command.displayName));
    }

    await this.userRepository.save(user);
  }
}
