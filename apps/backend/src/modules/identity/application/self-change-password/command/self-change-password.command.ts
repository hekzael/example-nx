export interface SelfChangePasswordCommand {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
