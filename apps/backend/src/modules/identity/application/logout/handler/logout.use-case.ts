import { LogoutCommand } from '@identity/application/logout/command/logout.command';
import { LogoutPort } from '@identity/application/logout/port/logout.port';
import { RefreshTokenPort } from '@identity/application/shared/port/refresh-token.port';

export class LogoutUseCase implements LogoutPort {
  constructor(private readonly refreshTokenPort: RefreshTokenPort) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.refreshTokenPort.revoke(command.refreshToken);
  }
}
