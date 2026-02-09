import { GetUserQuery } from '../command/get-user.query';

export interface GetUserPort {
  execute(command: GetUserQuery): Promise<{
    userId: string;
    email: string;
    displayName: string;
    isActive: boolean;
    emailVerifiedAt: Date | null;
  }>;
}
