import { LoginCommand } from '../command/login.command';

export interface LoginPort {
  execute(command: LoginCommand): Promise<{
    userId: string;
    accessToken: string;
    refreshToken: string;
  }>;
}
