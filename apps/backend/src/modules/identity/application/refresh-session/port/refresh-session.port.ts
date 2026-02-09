import { RefreshSessionCommand } from '@identity/application/refresh-session/command/refresh-session.command';

export interface RefreshSessionPort {
  execute(command: RefreshSessionCommand): Promise<{
    userId: string;
    accessToken: string;
    refreshToken: string;
  }>;
}
