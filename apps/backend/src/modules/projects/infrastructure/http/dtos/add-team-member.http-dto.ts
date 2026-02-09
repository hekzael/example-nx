import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamMemberRoleEnum } from '@projects/domain/team/value-objects/team-member-role.enum';

export class AddTeamMemberHttpDto {
  @IsString()
  readonly userId!: string;

  @IsEnum(TeamMemberRoleEnum)
  readonly role!: TeamMemberRoleEnum;

  @IsDateString()
  @Type(() => Date)
  readonly validFrom!: Date;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  readonly validUntil?: Date | null;
}
