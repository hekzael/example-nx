import { GetMyTeamsQuery } from '@identity/application/get-my-teams/command/get-my-teams.query';
import { GetMyTeamsPort } from '@identity/application/get-my-teams/port/get-my-teams.port';
import { CurrentUserReadPort } from '@identity/application/shared/port/current-user-read.port';

export class GetMyTeamsUseCase implements GetMyTeamsPort {
  constructor(private readonly currentUserReadPort: CurrentUserReadPort) {}

  async execute(command: GetMyTeamsQuery) {
    const result = await this.currentUserReadPort.getTeams(command.userId, {
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
