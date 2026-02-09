import { GetMyRolesQuery } from '../command/get-my-roles.query';

export interface GetMyRolesPort {
  execute(command: GetMyRolesQuery): Promise<
    {
      items: Array<{
        userProjectRoleId: string;
        projectId: string;
        projectCode: string;
        projectName: string;
        projectRoleId: string;
        projectRoleName: string;
        validFrom: Date;
        validUntil: Date | null;
      }>;
      total: number;
      page: number;
      pageSize: number;
      pages: number;
    }
  >;
}
