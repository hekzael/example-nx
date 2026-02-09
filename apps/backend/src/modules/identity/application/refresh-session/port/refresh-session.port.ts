import { RefreshSessionCommand } from '../command/refresh-session.command';

export interface RefreshSessionPort {
  execute(command: RefreshSessionCommand): Promise<{
    userId: string;
    accessToken: string;
    refreshToken: string;
  }>;
}
