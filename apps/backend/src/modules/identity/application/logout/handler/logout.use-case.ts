import { LogoutCommand } from '../command/logout.command';
import { LogoutPort } from '../port/logout.port';
import { RefreshTokenPort } from '../../shared/port/refresh-token.port';

export class LogoutUseCase implements LogoutPort {
  constructor(private readonly refreshTokenPort: RefreshTokenPort) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.refreshTokenPort.revoke(command.refreshToken);
  }
}
