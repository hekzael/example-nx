import { InvalidTokenException } from '@identity/domain/user/errors/invalid-token.exception';
import { UserNotFoundException } from '@identity/domain/user/errors/user-not-found.exception';
import { UserId } from '@identity/domain/user/value-objects/user-id.vo';
import { UserRepositoryPort } from '@identity/domain/user/repository/user-repository.port';
import { RefreshSessionCommand } from '@identity/application/refresh-session/command/refresh-session.command';
import { RefreshSessionPort } from '@identity/application/refresh-session/port/refresh-session.port';
import { RefreshTokenPort } from '@identity/application/shared/port/refresh-token.port';
import { TokenSigningPort } from '@identity/application/shared/port/token-signing.port';

export class RefreshSessionUseCase implements RefreshSessionPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly refreshTokenPort: RefreshTokenPort,
    private readonly tokenSigningPort: TokenSigningPort,
  ) {}

  async execute(command: RefreshSessionCommand): Promise<{
    userId: string;
    accessToken: string;
    refreshToken: string;
  }> {
    const userIdValue = await this.refreshTokenPort.consume(
      command.refreshToken,
    );
    if (!userIdValue) {
      throw new InvalidTokenException();
    }

    const user = await this.userRepository.findById(new UserId(userIdValue));
    if (!user) {
      throw new UserNotFoundException();
    }

    const accessToken = await this.tokenSigningPort.signAccessToken(userIdValue);
    const refreshToken = await this.refreshTokenPort.create(userIdValue);

    return { userId: userIdValue, accessToken, refreshToken };
  }
}
