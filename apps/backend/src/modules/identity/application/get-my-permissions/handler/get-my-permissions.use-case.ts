import { GetMyPermissionsQuery } from '../command/get-my-permissions.query';
import { GetMyPermissionsPort } from '../port/get-my-permissions.port';
import { CurrentUserReadPort } from '../../shared/port/current-user-read.port';

export class GetMyPermissionsUseCase implements GetMyPermissionsPort {
  constructor(private readonly currentUserReadPort: CurrentUserReadPort) {}

  async execute(command: GetMyPermissionsQuery) {
    const result = await this.currentUserReadPort.getPermissions(
      command.userId,
      {
        page: command.page,
        pageSize: command.pageSize,
      },
    );
    return {
      items: result.items,
      total: result.total,
      page: command.page,
      pageSize: command.pageSize,
      pages: Math.max(1, Math.ceil(result.total / command.pageSize)),
    };
  }
}
