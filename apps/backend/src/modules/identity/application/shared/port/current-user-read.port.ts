export interface CurrentUserReadPort {
  getRoles(
    userId: string,
    pagination: { page: number; pageSize: number },
  ): Promise<{
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
  }>;
  getPermissions(
    userId: string,
    pagination: { page: number; pageSize: number },
  ): Promise<{
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
  }>;
  getTeams(
    userId: string,
    pagination: { page: number; pageSize: number },
  ): Promise<{
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
  }>;
}
