import { GetMyPermissionsQuery } from '../command/get-my-permissions.query';

export interface GetMyPermissionsPort {
  execute(command: GetMyPermissionsQuery): Promise<
    {
      items: Array<{
        projectPermissionId: string;
        projectId: string;
        projectCode: string;
        projectName: string;
        projectModuleId: string | null;
        projectModuleCode: string | null;
        projectModuleName: string | null;
        projectEnvironmentId: string | null;
        projectEnvironmentCode: string | null;
        projectEnvironmentName: string | null;
        action: string;
        projectRoleId: string;
        projectRoleName: string;
      }>;
      total: number;
      page: number;
      pageSize: number;
      pages: number;
    }
  >;
}
