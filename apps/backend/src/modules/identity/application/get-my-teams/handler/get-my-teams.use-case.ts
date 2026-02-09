import { GetMyTeamsQuery } from '../command/get-my-teams.query';
import { GetMyTeamsPort } from '../port/get-my-teams.port';
import { CurrentUserReadPort } from '../../shared/port/current-user-read.port';

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
