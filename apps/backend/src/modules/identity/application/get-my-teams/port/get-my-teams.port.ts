import { GetMyTeamsQuery } from '../command/get-my-teams.query';

export interface GetMyTeamsPort {
  execute(command: GetMyTeamsQuery): Promise<
    {
      items: Array<{
        teamMemberId: string;
        teamId: string;
        teamName: string;
        teamRole: string;
        validFrom: Date;
        validUntil: Date | null;
        projectId: string;
        projectCode: string;
        projectName: string;
        projectModuleId: string | null;
        projectModuleCode: string | null;
        projectModuleName: string | null;
      }>;
      total: number;
      page: number;
      pageSize: number;
      pages: number;
    }
  >;
}
