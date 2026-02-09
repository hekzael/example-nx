import { UserNotFoundException } from '../../../domain/user/errors/user-not-found.exception';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { GetUserQuery } from '../command/get-user.query';
import { GetUserPort } from '../port/get-user.port';

export class GetUserUseCase implements GetUserPort {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: GetUserQuery): Promise<{
    userId: string;
    email: string;
    displayName: string;
    isActive: boolean;
    emailVerifiedAt: Date | null;
  }> {
    const user = await this.userRepository.findById(new UserId(command.userId));
    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      userId: user.getUserId().value,
      email: user.getEmail().value,
      displayName: user.getDisplayName().value,
      isActive: user.isUserActive(),
      emailVerifiedAt: user.getEmailVerifiedAt(),
    };
  }
}
