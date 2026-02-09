import { GetUserQuery } from '@identity/application/get-user/command/get-user.query';

export interface GetUserPort {
  execute(command: GetUserQuery): Promise<{
    userId: string;
    email: string;
    displayName: string;
    isActive: boolean;
    emailVerifiedAt: Date | null;
  }>;
}
