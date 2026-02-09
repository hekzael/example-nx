import { UpdateProfileCommand } from '../command/update-profile.command';

export interface UpdateProfilePort {
  execute(command: UpdateProfileCommand): Promise<void>;
}
