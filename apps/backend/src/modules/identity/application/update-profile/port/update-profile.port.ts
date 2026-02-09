import { UpdateProfileCommand } from '@identity/application/update-profile/command/update-profile.command';

export interface UpdateProfilePort {
  execute(command: UpdateProfileCommand): Promise<void>;
}
