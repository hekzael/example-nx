import { UserNotFoundException } from '@identity/domain/user/errors/user-not-found.exception';
import { UserException } from '@identity/domain/user/errors/user.exception';
import { Email } from '@identity/domain/user/value-objects/email.vo';
import { UserRepositoryPort } from '@identity/domain/user/repository/user-repository.port';
import { LoginCommand } from '@identity/application/login/command/login.command';
import { LoginPort } from '@identity/application/login/port/login.port';
import { PasswordHashingPort } from '@identity/application/shared/port/password-hashing.port';
import { RefreshTokenPort } from '@identity/application/shared/port/refresh-token.port';
import { TokenSigningPort } from '@identity/application/shared/port/token-signing.port';

export class LoginUseCase implements LoginPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHashingPort: PasswordHashingPort,
    private readonly refreshTokenPort: RefreshTokenPort,
    private readonly tokenSigningPort: TokenSigningPort,
  ) {}

  async execute(command: LoginCommand): Promise<{
    userId: string;
    accessToken: string;
    refreshToken: string;
  }> {
    const email = new Email(command.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (!user.isUserActive()) {
      throw new UserException('User is inactive');
    }

    const matches = await this.passwordHashingPort.verify(
      command.password,
      user.getPasswordHash().value,
    );
    if (!matches) {
      throw new UserException('Invalid credentials');
    }

    const userId = user.getUserId().value;
    const accessToken = await this.tokenSigningPort.signAccessToken(userId);
    const refreshToken = await this.refreshTokenPort.create(userId);

    return { userId, accessToken, refreshToken };
  }
}
