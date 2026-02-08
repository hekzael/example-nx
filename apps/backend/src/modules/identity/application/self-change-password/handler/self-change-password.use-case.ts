import { ChangePasswordUseCase } from '../../change-password/handler/change-password.use-case';
import { SelfChangePasswordCommand } from '../command/self-change-password.command';

export interface SelfChangePasswordResult {
  status: string;
}

export class SelfChangePasswordUseCase {
  constructor(private readonly changePassword: ChangePasswordUseCase) {}

  async execute(command: SelfChangePasswordCommand): Promise<SelfChangePasswordResult> {
    return this.changePassword.execute({
      userId: command.userId,
      currentPassword: command.currentPassword,
      newPassword: command.newPassword,
    });
  }
}
