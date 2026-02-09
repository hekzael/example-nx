import { Expose } from 'class-transformer';

export class MyTeamItemResponseDto {
  @Expose()
  readonly teamMemberId!: string;

  @Expose()
  readonly teamId!: string;

  @Expose()
  readonly teamName!: string;

  @Expose()
  readonly teamRole!: string;

  @Expose()
  readonly validFrom!: Date;

  @Expose()
  readonly validUntil!: Date | null;

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
}
