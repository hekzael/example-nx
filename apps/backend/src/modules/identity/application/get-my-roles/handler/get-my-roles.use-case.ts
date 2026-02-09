import { GetMyRolesQuery } from '@identity/application/get-my-roles/command/get-my-roles.query';
import { GetMyRolesPort } from '@identity/application/get-my-roles/port/get-my-roles.port';
import { CurrentUserReadPort } from '@identity/application/shared/port/current-user-read.port';

export class GetMyRolesUseCase implements GetMyRolesPort {
  constructor(private readonly currentUserReadPort: CurrentUserReadPort) {}

  async execute(command: GetMyRolesQuery) {
    const result = await this.currentUserReadPort.getRoles(command.userId, {
      page: command.page,
      pageSize: command.pageSize,
    });
    return {
      items: result.items,
      total: result.total,
      page: command.page,
      pageSize: command.pageSize,
      pages: Math.max(1, Math.ceil(result.total / command.pageSize)),
    };
  }
}
