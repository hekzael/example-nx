import { Expose } from 'class-transformer';

export class MyRoleItemResponseDto {
  @Expose()
  readonly userProjectRoleId!: string;

  @Expose()
  readonly projectId!: string;

  @Expose()
  readonly projectCode!: string;

  @Expose()
  readonly projectName!: string;

  @Expose()
  readonly projectRoleId!: string;

  @Expose()
  readonly projectRoleName!: string;

  @Expose()
  readonly validFrom!: Date;

  @Expose()
  readonly validUntil!: Date | null;
}
