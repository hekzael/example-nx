import { Expose } from 'class-transformer';

export class MyPermissionItemResponseDto {
  @Expose()
  readonly projectPermissionId!: string;

  @Expose()
  readonly projectId!: string;

  @Expose()
  readonly projectCode!: string;

  @Expose()
  readonly projectName!: string;

  @Expose()
  readonly projectModuleId!: string | null;

  @Expose()
  readonly projectModuleCode!: string | null;

  @Expose()
  readonly projectModuleName!: string | null;

  @Expose()
  readonly projectEnvironmentId!: string | null;

  @Expose()
  readonly projectEnvironmentCode!: string | null;

  @Expose()
  readonly projectEnvironmentName!: string | null;

  @Expose()
  readonly action!: string;

  @Expose()
  readonly projectRoleId!: string;

  @Expose()
  readonly projectRoleName!: string;
}
